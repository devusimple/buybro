"use client"

import * as React from "react"
import { CreditCard } from "lucide-react"
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useI18n } from "@/lib/i18n"

type OrderPoint = {
  status?: string
  paymentMethod?: string | null
}

const METHOD_COLORS: Record<string, string> = {
  cod: "var(--chart-2)",
  online: "var(--chart-4)",
}

function methodLabel(t: ReturnType<typeof useI18n>["t"], method: string) {
  return (
    {
      cod: t("checkout.cod"),
      online: t("checkout.onlinePayment"),
    }[method] ?? method
  )
}

export function AdminPaymentSplit({ orders }: { orders: OrderPoint[] }) {
  const { t } = useI18n()

  const rows = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const order of orders) {
      if (order.status === "cancelled") {
        continue
      }
      const method = order.paymentMethod ?? ""
      counts.set(method, (counts.get(method) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([method, count]) => ({
        method,
        count,
        fill: METHOD_COLORS[method] ?? "var(--muted-foreground)",
      }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [orders])

  const total = rows.reduce((sum, entry) => sum + entry.count, 0)

  if (total === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>{t("admin.paymentSplitTitle")}</CardTitle>
          <CardDescription>
            {t("admin.paymentSplitDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CreditCard />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noPayments")}</EmptyTitle>
              <EmptyDescription>{t("admin.noPaymentsHint")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = Object.fromEntries(
    rows.map((entry) => [
      entry.method,
      {
        label: methodLabel(t, entry.method),
        color: entry.fill,
      },
    ])
  ) satisfies ChartConfig

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.paymentSplitTitle")}</CardTitle>
        <CardDescription>{t("admin.paymentSplitDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={rows}
              dataKey="count"
              nameKey="method"
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
          {rows.map((entry) => {
            const percentage =
              total > 0 ? Math.round((entry.count / total) * 100) : 0
            return (
              <div
                key={entry.method}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="flex-1">{methodLabel(t, entry.method)}</span>
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
