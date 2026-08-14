import { id } from "@instantdb/react"

import { clientDb } from "@/lib/clientDb"

export function notifyOrderStatus({
  ownerId,
  orderId,
  status,
  createdAt = Date.now(),
}: {
  ownerId: string
  orderId: string
  status: string
  createdAt?: number
}) {
  return clientDb.tx.notifications[id()].create({
    ownerId,
    orderId,
    type: "order-status",
    status,
    read: false,
    createdAt,
  })
}
