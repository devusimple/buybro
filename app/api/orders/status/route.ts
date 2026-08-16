import { id } from "@instantdb/admin"
import { NextResponse } from "next/server"
import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"
import { adminDb } from "@/lib/adminDb"
import { isOrderStatus, type OrderStatus } from "@/lib/orders"

export const runtime = "nodejs"

/* eslint-disable @typescript-eslint/no-empty-object-type */
type OrderItem = InstaQLEntity<
  AppSchema,
  "orderItems",
  { product: { variants: {} } }
>
/* eslint-enable @typescript-eslint/no-empty-object-type */

// Forward-only state machine. Cancellation is a valid branch from any
// fulfilable state; delivered and cancelled are terminal.
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
}

const BUYER_CANCEL_ALLOWED: OrderStatus[] = ["pending", "confirmed"]

function fail(error: string, status = 200) {
  return NextResponse.json({ ok: false, error }, { status })
}

export async function POST(request: Request) {
  let body: { refreshToken?: unknown; orderId?: unknown; status?: unknown }
  try {
    body = await request.json()
  } catch {
    return fail("admin.updateError")
  }

  const { refreshToken, orderId, status } = body
  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    return fail("admin.updateError", 401)
  }
  if (typeof orderId !== "string" || orderId.length === 0) {
    return fail("admin.updateError")
  }
  if (typeof status !== "string" || !isOrderStatus(status)) {
    return fail("admin.updateError")
  }

  let user
  try {
    user = await adminDb.auth.verifyToken(refreshToken)
  } catch {
    return fail("admin.updateError", 401)
  }
  if (!user || typeof user.id !== "string") {
    return fail("admin.updateError", 401)
  }

  const { orders, couponUsages, $users } = await adminDb.query({
    orders: {
      $: { where: { id: orderId } },
      items: { product: { variants: {} } },
    },
    couponUsages: {
      $: { where: { orderId } },
    },
    $users: {
      $: { where: { id: user.id } },
      roles: {},
    },
  })

  const order = orders[0]
  if (!order) {
    return fail("orderDetail.notFound")
  }

  const isAdmin = ($users?.[0]?.roles ?? []).some(
    (role) => (role as { type?: unknown }).type === "admin"
  )
  const isOwner = order.ownerId === user.id
  if (!isAdmin && !isOwner) {
    return fail("admin.updateError", 401)
  }

  const next = status as OrderStatus
  const current = isOrderStatus(order.status) ? order.status : "pending"

  if (next === current) {
    return NextResponse.json({ ok: true })
  }

  if (!isAdmin) {
    if (next !== "cancelled" || !BUYER_CANCEL_ALLOWED.includes(current)) {
      return fail("orderDetail.cancelError")
    }
  } else if (!(TRANSITIONS[current] ?? []).includes(next)) {
    return fail("admin.invalidStatus")
  }

  const isCancelling = next === "cancelled"

  const txs: unknown[] = [
    adminDb.tx.orders[order.id].update({ status: next }),
    adminDb.tx.notifications[id()].create({
      ownerId: order.ownerId,
      orderId: order.id,
      type: "order-status",
      status: next,
      read: false,
      createdAt: Date.now(),
    }),
  ]

  if (isCancelling) {
    for (const item of (order.items ?? []) as OrderItem[]) {
      const quantity = item.quantity ?? 0
      const product = item.product
      if (quantity <= 0 || !product) {
        continue
      }
      if (item.variant && product.variants) {
        const variant = product.variants.find((v) => v.value === item.variant)
        if (variant && variant.stock != null) {
          txs.push(
            adminDb.tx.productVariants[variant.id].update({
              stock: (variant.stock ?? 0) + quantity,
            })
          )
          continue
        }
      }
      if (product.stock != null) {
        txs.push(
          adminDb.tx.products[product.id].update({
            stock: (product.stock ?? 0) + quantity,
          })
        )
      }
    }
    for (const usage of couponUsages ?? []) {
      txs.push(adminDb.tx.couponUsages[usage.id].delete())
    }
  }

  try {
    await adminDb.transact(txs as Parameters<typeof adminDb.transact>[0])
  } catch {
    return fail("admin.updateError")
  }

  return NextResponse.json({ ok: true })
}
