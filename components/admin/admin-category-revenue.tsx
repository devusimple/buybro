"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type CategoryOrderPoint = {
  status?: string
  items?:
    | {
        quantity?: number
        priceCents?: number
        product?: { category?: { name?: string } | null } | null
      }[]
    | null
}

export function AdminCategoryRevenue({
  orders,
}: {
  orders: CategoryOrderPoint[]
}) {
  const { t } = useI18n()

  const data = React.useMemo(() => {
    const byCategory = new Map<string, number>()
    for (const order of orders) {
      if (order.status === "cancelled") {
        continue
      }
      for (const item of order.items ?? []) {
        const category = item.product?.category?.name
        if (!category) {
          continue
        }
        byCategory.set(
          category,
          (byCategory.get(category) ?? 0) +
            (item.priceCents ?? 0) * (item.quantity ?? 0)
        )
      }
    }
    return [...byCategory.entries()]
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
  }, [orders])

  if (data.length === 0) {
    return null
  }

  const chartConfig = {
    revenue: {
      label: t("admin.revenue"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.categoryRevenueTitle")}</CardTitle>
        <CardDescription>
          {t("admin.categoryRevenueDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 8 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="revenue" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => formatPrice(Number(value))}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={4}
              maxBarSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
