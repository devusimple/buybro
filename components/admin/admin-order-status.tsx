"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
import { useI18n } from "@/lib/i18n"
import { ORDER_STATUSES } from "@/lib/orders"

type OrderPoint = {
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-2)",
  confirmed: "var(--chart-3)",
  shipped: "var(--chart-4)",
  delivered: "var(--chart-1)",
  cancelled: "var(--destructive)",
}

function statusLabel(t: ReturnType<typeof useI18n>["t"], status: string) {
  return (
    {
      pending: t("orders.statusPending"),
      confirmed: t("orders.statusConfirmed"),
      shipped: t("orders.statusShipped"),
      delivered: t("orders.statusDelivered"),
      cancelled: t("orders.statusCancelled"),
    }[status] ?? status
  )
}

export function AdminOrderStatus({ orders }: { orders: OrderPoint[] }) {
  const { t } = useI18n()

  const counts = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const order of orders) {
      map.set(order.status, (map.get(order.status) ?? 0) + 1)
    }
    return ORDER_STATUSES.map((status) => ({
      status,
      count: map.get(status) ?? 0,
      fill: STATUS_COLORS[status] ?? "var(--muted-foreground)",
    })).filter((entry) => entry.count > 0)
  }, [orders])

  const total = counts.reduce((sum, entry) => sum + entry.count, 0)

  if (total === 0) {
    return null
  }

  const chartConfig = Object.fromEntries(
    counts.map((entry) => [
      entry.status,
      {
        label: statusLabel(t, entry.status),
        color: entry.fill,
      },
    ])
  ) satisfies ChartConfig

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.orderStatusTitle")}</CardTitle>
        <CardDescription>{t("admin.orderStatusDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={counts}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (
                    viewBox &&
                    "cx" in viewBox &&
                    "cy" in viewBox &&
                    viewBox.cx != null &&
                    viewBox.cy != null
                  ) {
                    const cx = viewBox.cx
                    const cy = viewBox.cy
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy - 6}
                          className="fill-foreground text-2xl font-bold tabular-nums"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 16}
                          className="fill-muted-foreground text-xs"
                        >
                          {t("admin.orderStatusTotal")}
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-2">
          {counts.map((entry) => {
            const percentage =
              total > 0 ? Math.round((entry.count / total) * 100) : 0
            return (
              <div
                key={entry.status}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="flex-1">{statusLabel(t, entry.status)}</span>
                <span className="text-muted-foreground tabular-nums">
                  {percentage}%
                </span>
                <span className="font-medium tabular-nums">{entry.count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
