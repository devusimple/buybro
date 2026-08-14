import { NextResponse } from "next/server"
import { id } from "@instantdb/admin"
import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"
import { adminDb } from "@/lib/adminDb"
import {
  computeDiscountCents,
  couponError,
  findCoupon,
  normalizeCode,
} from "@/lib/coupons"
import type { PaymentMethod, ShippingSnapshot } from "@/lib/orders"

export const runtime = "nodejs"

type CheckoutLine = {
  id: string
  quantity: number
  variant?: string
}

type Variant = InstaQLEntity<AppSchema, "productVariants">

function fail(error: string, params?: Record<string, string>, status = 200) {
  return NextResponse.json({ ok: false, error, params }, { status })
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return value === "cod" || value === "online"
}

export async function POST(request: Request) {
  let body: {
    refreshToken?: unknown
    ownerEmail?: unknown
    items?: unknown
    couponCode?: unknown
    paymentMethod?: unknown
    shipping?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return fail("checkout.placeError")
  }

  const { refreshToken, ownerEmail, couponCode, paymentMethod, shipping } = body
  const rawItems = body.items

  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    return fail("checkout.placeError", undefined, 401)
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fail("checkout.placeError")
  }
  if (rawItems.length > 100) {
    return fail("checkout.placeError")
  }
  if (typeof paymentMethod !== "string" || !isPaymentMethod(paymentMethod)) {
    return fail("checkout.placeError")
  }
  if (typeof shipping !== "object" || shipping === null) {
    return fail("checkout.placeError")
  }

  let user
  try {
    user = await adminDb.auth.verifyToken(refreshToken)
  } catch {
    return fail("checkout.placeError", undefined, 401)
  }
  if (!user || typeof user.id !== "string") {
    return fail("checkout.placeError", undefined, 401)
  }

  const lines: CheckoutLine[] = rawItems.map((item) => ({
    id: String((item as { id?: unknown }).id ?? ""),
    quantity: (item as { quantity?: unknown }).quantity as number,
    variant:
      typeof (item as { variant?: unknown }).variant === "string"
        ? ((item as { variant?: unknown }).variant as string)
        : undefined,
  }))
  for (const line of lines) {
    if (
      typeof line.id !== "string" ||
      line.id.length === 0 ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 999
    ) {
      return fail("checkout.placeError")
    }
  }

  const { products, coupons, couponUsages } = await adminDb.query({
    products: { variants: {} },
    coupons: {},
    couponUsages: {
      $: {
        where: {
          code: normalizeCode(typeof couponCode === "string" ? couponCode : ""),
        },
      },
    },
  })

  const productById = new Map(products.map((product) => [product.id, product]))

  let subtotalCents = 0
  const orderLines: {
    productId: string
    variant?: Variant
    name: string
    priceCents: number
    stock?: number
    variantStock?: number
    quantity: number
  }[] = []
  for (const line of lines) {
    const product = productById.get(line.id)
    if (!product) {
      return fail("checkout.placeError")
    }
    let variant: Variant | undefined
    let priceCents = product.priceCents ?? 0
    if (line.variant) {
      variant = product.variants?.find(
        (candidate) => candidate.value === line.variant
      )
      if (!variant) {
        return fail("checkout.placeError")
      }
      priceCents = variant.priceCents ?? product.priceCents ?? 0
    }
    const stock = variant ? variant.stock : product.stock
    if (stock != null && line.quantity > stock) {
      return fail("checkout.outOfStock", { name: product.name })
    }
    subtotalCents += priceCents * line.quantity
    orderLines.push({
      productId: product.id,
      variant,
      name: product.name,
      priceCents,
      stock,
      variantStock: variant ? variant.stock : undefined,
      quantity: line.quantity,
    })
  }

  let discountCents = 0
  let appliedCode: string | undefined
  if (typeof couponCode === "string" && couponCode.length > 0) {
    const coupon = findCoupon(coupons, couponCode)
    const usageCount = (couponUsages ?? []).length
    const errorKey = couponError(coupon, { subtotalCents, usageCount })
    if (errorKey || !coupon) {
      return fail(errorKey ?? "coupons.notFound")
    }
    discountCents = computeDiscountCents(coupon, subtotalCents)
    appliedCode = coupon.code
  }

  const totalCents = Math.max(0, subtotalCents - discountCents)
  const count = orderLines.reduce((sum, line) => sum + line.quantity, 0)
  const orderId = id()
  const createdAt = Date.now()

  const isGuest = user.isGuest === true
  const finalOwnerEmail = isGuest
    ? typeof ownerEmail === "string" && ownerEmail.trim().length > 0
      ? ownerEmail.trim()
      : undefined
    : (user.email ?? undefined)

  const ship = shipping as ShippingSnapshot
  const txs: unknown[] = [
    adminDb.tx.orders[orderId].create({
      ownerId: user.id,
      ownerEmail: finalOwnerEmail,
      status: "pending",
      paymentMethod,
      totalCents,
      subtotalCents,
      discountCents,
      couponCode: appliedCode,
      shippingFullName: String(ship.fullName ?? ""),
      shippingPhone: String(ship.phone ?? ""),
      shippingHouseNo: String(ship.houseNo ?? ""),
      shippingRoad: String(ship.road ?? ""),
      shippingArea: String(ship.area ?? ""),
      shippingDistrict: String(ship.district ?? ""),
      shippingDivision: String(ship.division ?? ""),
      shippingPostalCode: String(ship.postalCode ?? ""),
      shippingCountry: String(ship.country ?? "Bangladesh"),
      createdAt,
    }),
    ...(appliedCode
      ? [
          adminDb.tx.couponUsages[id()].create({
            code: appliedCode,
            orderId,
            createdAt,
          }),
        ]
      : []),
  ]

  for (const line of orderLines) {
    const itemId = id()
    txs.push(
      adminDb.tx.orderItems[itemId]
        .create({
          quantity: line.quantity,
          priceCents: line.priceCents,
          name: line.name,
          variant: line.variant?.value,
        })
        .link({ order: orderId, product: line.productId })
    )
    if (line.stock != null) {
      txs.push(
        adminDb.tx.products[line.productId].update({
          stock: Math.max(0, line.stock - line.quantity),
        })
      )
    }
    if (line.variant && line.variantStock != null) {
      txs.push(
        adminDb.tx.productVariants[line.variant.id].update({
          stock: Math.max(0, line.variantStock - line.quantity),
        })
      )
    }
  }

  try {
    await adminDb.transact(txs as Parameters<typeof adminDb.transact>[0])
  } catch {
    return fail("checkout.placeError")
  }

  return NextResponse.json({ ok: true, orderId, totalCents, count })
}
