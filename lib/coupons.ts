import type { Coupon } from "@/lib/types"

export const DISCOUNT_TYPES = ["percent", "flat"] as const
export type DiscountType = (typeof DISCOUNT_TYPES)[number]

export function isDiscountType(value: string): value is DiscountType {
  return (DISCOUNT_TYPES as readonly string[]).includes(value)
}

export function normalizeCode(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "")
}

export function findCoupon(coupons: Coupon[], raw: string) {
  const code = normalizeCode(raw)
  return coupons.find((coupon) => normalizeCode(coupon.code) === code)
}

export function computeDiscountCents(coupon: Coupon, subtotalCents: number) {
  const discount =
    coupon.discountType === "percent"
      ? Math.round(subtotalCents * (coupon.value / 100))
      : coupon.value
  const capped =
    coupon.maxDiscountCents != null
      ? Math.min(discount, coupon.maxDiscountCents)
      : discount
  return Math.max(0, Math.min(capped, subtotalCents))
}

export type CouponErrorKey =
  | "coupons.notFound"
  | "coupons.inactive"
  | "coupons.notStarted"
  | "coupons.expired"
  | "coupons.minSubtotal"
  | "coupons.fullyUsed"

export function couponError(
  coupon: Coupon | undefined,
  {
    subtotalCents,
    usageCount,
    now = Date.now(),
  }: {
    subtotalCents: number
    usageCount: number
    now?: number
  }
): CouponErrorKey | null {
  if (!coupon) {
    return "coupons.notFound"
  }
  if (coupon.active === false) {
    return "coupons.inactive"
  }
  if (coupon.startsAt != null && now < coupon.startsAt) {
    return "coupons.notStarted"
  }
  if (coupon.expiresAt != null && now > coupon.expiresAt) {
    return "coupons.expired"
  }
  if (
    coupon.minSubtotalCents != null &&
    subtotalCents < coupon.minSubtotalCents
  ) {
    return "coupons.minSubtotal"
  }
  if (coupon.usageLimit != null && usageCount >= coupon.usageLimit) {
    return "coupons.fullyUsed"
  }
  return null
}
