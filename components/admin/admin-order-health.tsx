"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type OrderPoint = {
  status?: string
  totalCents?: number
  discountCents?: number
}

export function AdminOrderHealth({ orders }: { orders: OrderPoint[] }) {
  const { t } = useI18n()

  const metrics = React.useMemo(() => {
    let cancelledCount = 0
    let cancelledRevenue = 0
    let savings = 0
    for (const order of orders) {
      if (order.status === "cancelled") {
        cancelledCount += 1
        cancelledRevenue += order.totalCents ?? 0
      } else {
        savings += order.discountCents ?? 0
      }
    }
    const rate =
      orders.length > 0
        ? Math.round((cancelledCount / orders.length) * 1000) / 10
        : 0
    return { cancelledCount, cancelledRevenue, savings, rate }
  }, [orders])

  if (orders.length === 0) {
    return null
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.orderHealthTitle")}</CardTitle>
        <CardDescription>{t("admin.orderHealthDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border/60">
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("admin.cancellationRate")}</p>
            <p className="text-xs text-muted-foreground">
              {t("admin.cancelledOrders", { count: metrics.cancelledCount })} ·{" "}
              <span className="tabular-nums">{orders.length}</span>{" "}
              {t("admin.orderStatusTotal")}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold tabular-nums">{metrics.rate}%</p>
            <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-destructive"
                style={{ width: `${Math.min(100, metrics.rate)}%` }}
              />
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("admin.lostRevenue")}</p>
            <p className="text-xs text-muted-foreground">
              {t("admin.lostRevenueHint")}
            </p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">
            {formatPrice(metrics.cancelledRevenue)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("admin.customerSavings")}</p>
            <p className="text-xs text-muted-foreground">
              {t("admin.customerSavingsHint")}
            </p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">
            {formatPrice(metrics.savings)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
