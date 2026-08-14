import { id } from "@instantdb/react"

import type { CartItem } from "@/lib/cart-store"
import { clientDb } from "@/lib/clientDb"

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

export const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  confirmed: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
}

export const STATUS_ORDER = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
] as const

export type ShippingSnapshot = {
  fullName: string
  phone: string
  houseNo: string
  road?: string
  area: string
  district: string
  division: string
  postalCode: string
  country?: string
}

export type StockLine = CartItem & {
  currentStock?: number
  variantStock?: number
}

export async function placeOrder({
  ownerId,
  ownerEmail,
  items,
  subtotalCents,
  discountCents,
  couponCode,
  shipping,
}: {
  ownerId: string
  ownerEmail?: string
  items: StockLine[]
  subtotalCents: number
  discountCents: number
  couponCode?: string
  shipping: ShippingSnapshot
}) {
  const orderId = id()
  const createdAt = Date.now()
  const totalCents = Math.max(0, subtotalCents - discountCents)

  const txs: unknown[] = [
    clientDb.tx.orders[orderId].create({
      ownerId,
      ownerEmail,
      status: "pending",
      totalCents,
      subtotalCents,
      discountCents,
      couponCode,
      shippingFullName: shipping.fullName,
      shippingPhone: shipping.phone,
      shippingHouseNo: shipping.houseNo,
      shippingRoad: shipping.road,
      shippingArea: shipping.area,
      shippingDistrict: shipping.district,
      shippingDivision: shipping.division,
      shippingPostalCode: shipping.postalCode,
      shippingCountry: shipping.country,
      createdAt,
    }),
    ...(couponCode
      ? [
          clientDb.tx.couponUsages[id()].create({
            code: couponCode,
            orderId,
            createdAt,
          }),
        ]
      : []),
    ...items.flatMap((item) => {
      const itemId = id()
      const stockTxs: unknown[] = []
      if (item.currentStock != null) {
        stockTxs.push(
          clientDb.tx.products[item.id].update({
            stock: Math.max(0, item.currentStock - item.quantity),
          })
        )
      }
      if (item.variantId && item.variantStock != null) {
        stockTxs.push(
          clientDb.tx.productVariants[item.variantId].update({
            stock: Math.max(0, item.variantStock - item.quantity),
          })
        )
      }
      const orderItemTx = clientDb.tx.orderItems[itemId]
        .create({
          quantity: item.quantity,
          priceCents: item.priceCents,
          name: item.name,
          variant: item.variant,
        })
        .link({ order: orderId, product: item.id })
      return [orderItemTx, ...stockTxs]
    }),
  ]

  await clientDb.transact(txs as Parameters<typeof clientDb.transact>[0])
  return orderId
}
