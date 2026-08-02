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

export async function placeOrder({
  ownerId,
  items,
  totalCents,
}: {
  ownerId: string
  items: CartItem[]
  totalCents: number
}) {
  const orderId = id()
  const createdAt = Date.now()
  const txs = [
    clientDb.tx.orders[orderId].create({
      ownerId,
      status: "pending",
      totalCents,
      createdAt,
    }),
    ...items.map((item) => {
      const itemId = id()
      return clientDb.tx.orderItems[itemId]
        .create({ quantity: item.quantity, priceCents: item.priceCents })
        .link({ order: orderId, product: item.id })
    }),
  ]
  await clientDb.transact(txs)
  return orderId
}
