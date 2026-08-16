"use client"

import * as React from "react"
import { ShoppingBag } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type AdminOrderPoint = {
  status: string
  items?: {
    id: string
    product?: { id: string; name: string } | null
    name?: string | null
    quantity?: number | null
    priceCents?: number | null
  }[]
}

type TopProduct = {
  id: string
  name: string
  units: number
  revenueCents: number
}

export function AdminBestSellers({ orders }: { orders: AdminOrderPoint[] }) {
  const { t } = useI18n()

  const top = React.useMemo(() => {
    const byId = new Map<string, TopProduct>()
    for (const order of orders) {
      if (order.status === "cancelled") {
        continue
      }
      for (const item of order.items ?? []) {
        const id = item.product?.id ?? item.id
        const name = item.product?.name ?? item.name ?? t("orders.product")
        const quantity = item.quantity ?? 0
        const revenue = (item.priceCents ?? 0) * quantity
        const existing = byId.get(id)
        if (existing) {
          existing.units += quantity
          existing.revenueCents += revenue
        } else {
          byId.set(id, { id, name, units: quantity, revenueCents: revenue })
        }
      }
    }
    return Array.from(byId.values())
      .sort((a, b) => b.units - a.units)
      .slice(0, 5)
  }, [orders, t])

  const totalUnits = top.reduce((sum, product) => sum + product.units, 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.bestSellersTitle")}</CardTitle>
        <CardDescription>{t("admin.bestSellersDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noBestSellers")}</EmptyTitle>
              <EmptyDescription>
                {t("admin.noBestSellersHint")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {top.map((product, index) => {
              const share =
                totalUnits > 0
                  ? Math.round((product.units / totalUnits) * 100)
                  : 0
              return (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {t("admin.unitsSold", { count: product.units })}
                      </p>
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${share}%` }}
                        />
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {share}%
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatPrice(product.revenueCents)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
