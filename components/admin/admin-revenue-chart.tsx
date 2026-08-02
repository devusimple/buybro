"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type OrderPoint = {
  createdAt: number
  totalCents: number
  status: string
}

const DAY_MS = 24 * 60 * 60 * 1000

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function AdminRevenueChart({ orders }: { orders: OrderPoint[] }) {
  const { t, locale } = useI18n()
  const [days, setDays] = React.useState("30")
  const [now] = React.useState(() => Date.now())

  const series = React.useMemo(() => {
    const total = Number(days) * DAY_MS
    const start = now - total
    const buckets = new Map<string, number>()

    for (const order of orders) {
      if (order.status === "cancelled" || order.createdAt < start) {
        continue
      }
      const key = toDateKey(new Date(order.createdAt))
      buckets.set(key, (buckets.get(key) ?? 0) + order.totalCents)
    }

    const out: { date: string; revenue: number }[] = []
    const cursor = new Date(start)
    const today = new Date()
    while (cursor <= today) {
      const key = toDateKey(cursor)
      out.push({ date: key, revenue: buckets.get(key) ?? 0 })
      cursor.setDate(cursor.getDate() + 1)
    }
    return out
  }, [orders, days, now])

  const totalRevenue = series.reduce((sum, point) => sum + point.revenue, 0)

  const chartConfig = {
    revenue: {
      label: t("admin.revenue"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("admin.revenueOverview")}</CardTitle>
        <CardDescription>
          {t("admin.revenueDescription")} ·{" "}
          <span className="font-medium text-foreground">
            {formatPrice(totalRevenue)}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[days]}
            onValueChange={(value) => {
              setDays(value[0] ?? "30")
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90">
              {t("admin.last90Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30">
              {t("admin.last30Days")}
            </ToggleGroupItem>
            <ToggleGroupItem value="7">{t("admin.last7Days")}</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={days}
            onValueChange={(value) => {
              if (value !== null) {
                setDays(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={t("admin.rangeLabel")}
            >
              <SelectValue placeholder={t("admin.last30Days")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="90">{t("admin.last90Days")}</SelectItem>
                <SelectItem value="30">{t("admin.last30Days")}</SelectItem>
                <SelectItem value="7">{t("admin.last7Days")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={series} accessibilityLayer>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString(
                  locale === "bn" ? "bn-BD" : "en-BD",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(
                      locale === "bn" ? "bn-BD" : "en-BD",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  }}
                  formatter={(value) => (
                    <>
                      <span className="text-muted-foreground">
                        {t("admin.revenue")}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatPrice(Number(value))}
                      </span>
                    </>
                  )}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
