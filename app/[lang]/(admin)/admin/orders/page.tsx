"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { AdminOrder, AdminProfile } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import {
  isOrderStatus,
  ORDER_STATUSES,
  STATUS_VARIANTS,
  updateOrderStatus,
} from "@/lib/orders"
import { cn } from "@/lib/utils"

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

function paymentLabel(
  t: ReturnType<typeof useI18n>["t"],
  method?: string | null
) {
  if (method === "online") {
    return t("checkout.onlinePayment")
  }
  return t("checkout.cod")
}

export default function AdminOrdersPage() {
  const { t, locale } = useI18n()
  const { user } = clientDb.useAuth()
  const [filter, setFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<AdminOrder | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    orders: {
      $: { order: { createdAt: "desc" } },
      items: { product: {} },
    },
    profiles: {},
  })

  const orders = (data?.orders ?? []) as AdminOrder[]
  const profiles = (data?.profiles ?? []) as AdminProfile[]
  const profileByOwner = new Map(
    profiles.map((profile) => [profile.ownerId, profile])
  )

  const filtered = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  )

  function customerName(order: AdminOrder) {
    const profile = profileByOwner.get(order.ownerId)
    if (profile?.displayName) {
      return profile.displayName
    }
    return order.ownerId.slice(0, 8).toUpperCase()
  }

  async function runStatusChange(order: AdminOrder, value: string) {
    if (!isOrderStatus(value) || !user || value === order.status) {
      return
    }
    setError(null)
    setBusyId(order.id)
    try {
      const result = await updateOrderStatus({
        user,
        orderId: order.id,
        status: value,
      })
      if (!result.ok) {
        setError(
          t((result.error ?? "admin.updateError") as Parameters<typeof t>[0])
        )
      }
    } finally {
      setBusyId(null)
    }
  }

  function handleStatusChange(order: AdminOrder, value: string) {
    if (isOrderStatus(value) && value === "cancelled") {
      setCancelTarget(order)
      return
    }
    runStatusChange(order, value)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{t("admin.ordersTitle")}</CardTitle>
              <CardDescription>{t("admin.ordersDescription")}</CardDescription>
            </div>
            {orders.length > 0 && (
              <ToggleGroup
                variant="outline"
                size="sm"
                value={[filter]}
                onValueChange={(value) => setFilter(value[0] ?? "all")}
                className="flex-wrap"
              >
                <ToggleGroupItem value="all">
                  {t("admin.filterAll")}
                </ToggleGroupItem>
                {ORDER_STATUSES.map((status) => (
                  <ToggleGroupItem key={status} value={status}>
                    {statusLabel(t, status)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingCart />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noOrders")}</EmptyTitle>
                <EmptyDescription>{t("admin.noOrdersHint")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("admin.noFilteredOrders")}
            </p>
          ) : (
            <ul className="flex flex-col">
              {filtered.map((order) => {
                const items = order.items ?? []
                const itemCount = items.reduce(
                  (sum, item) => sum + (item.quantity ?? 0),
                  0
                )
                return (
                  <li key={order.id}>
                    <div className="flex flex-col gap-4 py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold tracking-widest uppercase">
                            {t("orders.orderPrefix")}
                            {order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customerName(order)} ·{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              locale === "bn" ? "bn-BD" : "en-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={STATUS_VARIANTS[order.status] ?? "outline"}
                          >
                            {statusLabel(t, order.status)}
                          </Badge>
                          <Badge variant="secondary">
                            {paymentLabel(t, order.paymentMethod)}
                          </Badge>
                          <span className="text-base font-semibold">
                            {formatPrice(order.totalCents)}
                          </span>
                        </div>
                      </div>

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
                              {formatPrice(
                                (item.priceCents ?? 0) * (item.quantity ?? 1)
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      {(order.shippingFullName ||
                        order.shippingArea ||
                        order.ownerEmail) && (
                        <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold tracking-widest uppercase">
                              {t("admin.contact")}
                            </span>
                            {order.shippingFullName && (
                              <span>
                                {order.shippingFullName}
                                {order.shippingPhone
                                  ? ` · ${order.shippingPhone}`
                                  : ""}
                              </span>
                            )}
                            {order.ownerEmail && (
                              <span>{order.ownerEmail}</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold tracking-widest uppercase">
                              {t("admin.shipTo")}
                            </span>
                            {order.shippingHouseNo && (
                              <span>
                                {[
                                  order.shippingHouseNo,
                                  order.shippingRoad,
                                  order.shippingArea,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                                {order.shippingDistrict
                                  ? `, ${order.shippingDistrict}`
                                  : ""}
                                {order.shippingPostalCode
                                  ? ` ${order.shippingPostalCode}`
                                  : ""}
                                {order.shippingDivision
                                  ? `, ${order.shippingDivision}`
                                  : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                        <span className="text-xs text-muted-foreground">
                          {itemCount === 1
                            ? t("common.item", { count: itemCount })
                            : t("common.items", { count: itemCount })}
                        </span>
                        <label className="flex items-center gap-2 text-xs">
                          <span className="font-semibold tracking-widest text-muted-foreground uppercase">
                            {t("admin.updateStatus")}
                          </span>
                          <Select
                            value={order.status}
                            disabled={busyId === order.id}
                            onValueChange={(value) => {
                              if (value !== null && isOrderStatus(value)) {
                                handleStatusChange(order, value)
                              }
                            }}
                          >
                            <SelectTrigger
                              size="sm"
                              aria-label={t("admin.updateStatus")}
                              className={cn(
                                "flex w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate",
                                order.status === "cancelled"
                                  ? "text-destructive"
                                  : "text-foreground"
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {statusLabel(t, status)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </label>
                      </div>
                    </div>
                    <Separator />
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.cancelOrderTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.cancelOrderConfirm", {
                id: cancelTarget?.id.slice(0, 8).toUpperCase() ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={cancelTarget !== null && busyId === cancelTarget.id}
              onClick={() => {
                const target = cancelTarget
                if (target) {
                  setCancelTarget(null)
                  runStatusChange(target, "cancelled")
                }
              }}
            >
              {cancelTarget !== null && busyId === cancelTarget.id
                ? t("admin.cancelling")
                : t("admin.cancelOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
