"use client"

import { PackageSearch } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type AdminOrderPoint = {
  status: string
  totalCents: number
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

export function AdminTopProducts({ orders }: { orders: AdminOrderPoint[] }) {
  const { t } = useI18n()

  const { topProducts, deliveredCount, completedRate } = (() => {
    const byId = new Map<string, TopProduct>()
    let delivered = 0
    for (const order of orders) {
      if (order.status === "cancelled") {
        continue
      }
      if (order.status === "delivered") {
        delivered += 1
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
    const total = orders.length
    const completedRate =
      total > 0 ? Math.round((delivered / total) * 1000) / 10 : 0
    return {
      topProducts: Array.from(byId.values())
        .sort((a, b) => b.revenueCents - a.revenueCents)
        .slice(0, 5),
      deliveredCount: delivered,
      completedRate,
    }
  })()

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.topProductsTitle")}</CardTitle>
        <CardDescription>
          {t("admin.topProductsDescription")}
          <span className="ml-2 inline-flex items-center gap-2">
            <Badge variant="secondary" className="shrink-0">
              {t("admin.conversionRate", { rate: completedRate })}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("admin.deliveredOrders", { count: deliveredCount })}
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageSearch />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noTopProducts")}</EmptyTitle>
              <EmptyDescription>
                {t("admin.noTopProductsHint")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {topProducts.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.unitsSold", { count: product.units })}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatPrice(product.revenueCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
