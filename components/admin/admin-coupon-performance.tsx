"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { normalizeCode } from "@/lib/coupons"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type CouponPoint = {
  code?: string
  usageLimit?: number | null
  active?: boolean | null
}

type CouponUsagePoint = {
  code?: string
  orderId?: string | null
}

type OrderPoint = {
  id: string
  totalCents?: number
  discountCents?: number
}

export function AdminCouponPerformance({
  coupons,
  couponUsages,
  orders,
}: {
  coupons: CouponPoint[]
  couponUsages: CouponUsagePoint[]
  orders: OrderPoint[]
}) {
  const { t } = useI18n()

  const rows = React.useMemo(() => {
    const orderById = new Map(orders.map((order) => [order.id, order]))
    const usageByCode = new Map<
      string,
      { count: number; discountCents: number; revenueCents: number }
    >()
    for (const usage of couponUsages) {
      const key = normalizeCode(usage.code ?? "")
      if (!key) {
        continue
      }
      const order = usage.orderId ? orderById.get(usage.orderId) : undefined
      const entry = usageByCode.get(key) ?? {
        count: 0,
        discountCents: 0,
        revenueCents: 0,
      }
      entry.count += 1
      entry.discountCents += order?.discountCents ?? 0
      entry.revenueCents += order?.totalCents ?? 0
      usageByCode.set(key, entry)
    }
    return coupons
      .map((coupon) => {
        const usage = usageByCode.get(normalizeCode(coupon.code ?? ""))
        return {
          code: coupon.code ?? "",
          usageLimit: coupon.usageLimit,
          active: coupon.active,
          count: usage?.count ?? 0,
          discountCents: usage?.discountCents ?? 0,
          revenueCents: usage?.revenueCents ?? 0,
        }
      })
      .filter((row) => row.code.length > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [coupons, couponUsages, orders])

  if (rows.length === 0) {
    return null
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.couponPerformanceTitle")}</CardTitle>
        <CardDescription>
          {t("admin.couponPerformanceDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {rows.map((row) => {
          const utilization =
            row.usageLimit != null && row.usageLimit > 0
              ? Math.min(100, (row.count / row.usageLimit) * 100)
              : null
          return (
            <div
              key={row.code}
              className="flex items-center gap-3 py-2.5 text-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-xs font-medium">
                    {row.code}
                  </span>
                  {row.active === false && (
                    <span className="rounded-sm bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                      {t("admin.inactive")}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t("admin.couponOrders", { count: row.count })}
                    {row.usageLimit != null &&
                      ` · ${t("admin.couponLeft", { count: Math.max(0, row.usageLimit - row.count) })}`}
                  </span>
                  {utilization != null && (
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${utilization}%` }}
                      />
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium tabular-nums">
                  {formatPrice(row.discountCents)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(row.revenueCents)} {t("admin.couponRevenue")}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
