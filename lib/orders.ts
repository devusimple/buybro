import type { User } from "@instantdb/react"

import type { CartItem } from "@/lib/cart-store"

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

export type PaymentMethod = "cod" | "online"

export type CheckoutSuccess = {
  ok: true
  orderId: string
  totalCents: number
  count: number
}

export type CheckoutFailure = {
  ok: false
  error: string
  params?: Record<string, string>
}

export type CheckoutResponse = CheckoutSuccess | CheckoutFailure

export async function placeOrder({
  user,
  ownerEmail,
  items,
  couponCode,
  paymentMethod,
  shipping,
}: {
  user: User
  ownerEmail?: string
  items: CartItem[]
  couponCode?: string
  paymentMethod: PaymentMethod
  shipping: ShippingSnapshot
}): Promise<CheckoutResponse> {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: user.refresh_token,
        ownerEmail,
        items: items.map((item) => ({
          id: item.id,
          variant: item.variant,
          quantity: item.quantity,
        })),
        couponCode,
        paymentMethod,
        shipping,
      }),
    })
    const data = await response.json()
    return data
  } catch {
    return { ok: false, error: "checkout.placeError" }
  }
}

export async function updateOrderStatus({
  user,
  orderId,
  status,
}: {
  user: User
  orderId: string
  status: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: user.refresh_token,
        orderId,
        status,
      }),
    })
    return await response.json()
  } catch {
    return { ok: false, error: "admin.updateError" }
  }
}
