"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, PackageCheck, ShoppingBag, Wallet } from "lucide-react"
import type { User } from "@instantdb/react"

import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { STATUS_VARIANTS } from "@/lib/orders"
import type { Order } from "@/lib/profile"

type Filter = "all" | "pending" | "delivered"

function OrderCard({ order }: { order: Order }) {
  const { t, locale } = useI18n()
  const items = order.items ?? []
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  const statusLabel =
    {
      pending: t("orders.statusPending"),
      confirmed: t("orders.statusConfirmed"),
      shipped: t("orders.statusShipped"),
      delivered: t("orders.statusDelivered"),
      cancelled: t("orders.statusCancelled"),
    }[order.status] ?? order.status

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    locale === "bn" ? "bn-BD" : "en-BD",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )

  return (
    <div className="flex flex-col gap-4 border border-border/60 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest uppercase">
            {t("orders.orderPrefix")}
            {order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">{orderDate}</p>
        </div>
        <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
          {statusLabel}
        </Badge>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="min-w-0 truncate text-muted-foreground">
              <span className="font-medium text-foreground">
                {item.quantity}×
              </span>{" "}
              {item.product?.name ?? t("orders.product")}
            </span>
            <span className="shrink-0">
              {formatPrice((item.priceCents ?? 0) * (item.quantity ?? 1))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs font-semibold tracking-widest uppercase">
          {itemCount === 1
            ? t("common.item", { count: itemCount })
            : t("common.items", { count: itemCount })}
        </span>
        <span className="text-base font-semibold">
          {formatPrice(order.totalCents)}
        </span>
      </div>
    </div>
  )
}

function StatsRow({ orders }: { orders: Order[] }) {
  const { t } = useI18n()
  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.totalCents, 0)

  const stats = [
    {
      label: t("orders.totalOrders"),
      value: String(orders.length),
      icon: ShoppingBag,
    },
    {
      label: t("orders.pendingOrders"),
      value: String(pendingCount),
      icon: Package,
    },
    {
      label: t("orders.totalSpent"),
      value: formatPrice(totalSpent),
      icon: Wallet,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 border border-border/60 p-5"
        >
          <stat.icon className="size-4 text-muted-foreground" />
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-semibold tracking-tight">
              {stat.value}
            </span>
            <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrdersSection({ user }: { user: User }) {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<Filter>("all")

  const { data, isLoading } = clientDb.useQuery({
    orders: {
      $: { where: { ownerId: user.id }, order: { createdAt: "desc" } },
      items: { product: {} },
    },
  })

  const orders = data?.orders ?? []

  const filtered = orders.filter((order) => {
    if (filter === "pending") {
      return order.status === "pending"
    }
    if (filter === "delivered") {
      return order.status === "delivered"
    }
    return true
  })

  const filterLabel =
    filter === "pending"
      ? t("orders.filterPending")
      : filter === "delivered"
        ? t("orders.filterDelivered")
        : t("orders.filterAll")

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("orders.title")}</CardTitle>
            <CardDescription>{t("orders.description")}</CardDescription>
          </div>
          {!isLoading && orders.length > 0 && (
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[filter]}
              onValueChange={(value) =>
                setFilter((value[0] as Filter | undefined) ?? "all")
              }
            >
              <ToggleGroupItem value="all">
                {t("orders.filterAll")}
              </ToggleGroupItem>
              <ToggleGroupItem value="pending">
                {t("orders.filterPending")}
              </ToggleGroupItem>
              <ToggleGroupItem value="delivered">
                {t("orders.filterDelivered")}
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {!isLoading && orders.length > 0 && <StatsRow orders={orders} />}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : orders.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageCheck />
              </EmptyMedia>
              <EmptyTitle>{t("orders.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                <span>{t("orders.emptyDescription")} </span>
                <Link
                  href={`/${locale}`}
                  className="font-medium underline underline-offset-4"
                >
                  {t("orders.startShopping")}
                </Link>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package />
              </EmptyMedia>
              <EmptyTitle>{t("orders.nothingTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("orders.nothingDescription", { filter: filterLabel })}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
