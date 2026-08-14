"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, MapPin, PackageCheck, Truck, User } from "lucide-react"
import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"
import { SignInForm } from "@/components/auth/sign-in-form"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { STATUS_ORDER, STATUS_VARIANTS } from "@/lib/orders"
import { cn } from "@/lib/utils"

function paymentLabel(
  t: ReturnType<typeof useI18n>["t"],
  method?: string | null
) {
  if (method === "online") {
    return t("checkout.onlinePayment")
  }
  return t("checkout.cod")
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
type OrderWithImage = InstaQLEntity<
  AppSchema,
  "orders",
  { items: { product: { image: {} } } }
>
/* eslint-enable @typescript-eslint/no-empty-object-type */

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

export default function OrderDetailPage() {
  const { t, locale } = useI18n()
  const params = useParams<{ orderId: string }>()
  const orderId = params.orderId
  const { user, isLoading: authLoading } = clientDb.useAuth()
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    orders: {
      $: { where: { id: orderId } },
      items: { product: { image: {} } },
    },
  })

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SignInForm />
      </div>
    )
  }

  const order = (data?.orders?.[0] ?? null) as OrderWithImage | null

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageCheck />
            </EmptyMedia>
            <EmptyTitle>{t("orderDetail.notFound")}</EmptyTitle>
            <EmptyDescription>
              <Link
                href={`/${locale}/profile`}
                className="font-medium underline underline-offset-4"
              >
                {t("orderDetail.backToOrders")}
              </Link>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  const items = order.items ?? []
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  const cancelled = order.status === "cancelled"
  const currentIndex = cancelled
    ? -1
    : STATUS_ORDER.indexOf(order.status as (typeof STATUS_ORDER)[number])
  const orderDate = new Date(order.createdAt).toLocaleDateString(
    locale === "bn" ? "bn-BD" : "en-BD",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )

  async function handleCancel() {
    setCancelling(true)
    setCancelError(null)
    try {
      await clientDb.transact(
        clientDb.tx.orders[orderId].update({ status: "cancelled" })
      )
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : t("orderDetail.cancelError")
      )
    } finally {
      setCancelling(false)
    }
  }

  const canCancel =
    !cancelled && ["pending", "confirmed"].includes(order.status)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/${locale}/profile`} />}
            nativeButton={false}
            className="-ml-2 w-fit"
          >
            <ArrowLeft data-icon="inline-start" />
            {t("orderDetail.backToOrders")}
          </Button>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight uppercase">
                {t("orderDetail.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("orders.orderPrefix")}
                {order.id.slice(0, 8).toUpperCase()} · {orderDate}
              </p>
            </div>
            <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
              {statusLabel(t, order.status)}
            </Badge>
          </div>
        </header>

        {cancelled && (
          <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/10 p-4">
            <Truck className="size-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">
              {t("orderDetail.cancelledBanner")}
            </p>
          </div>
        )}

        {!cancelled && (
          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetail.trackingTitle")}</CardTitle>
              <CardDescription>
                {t("orderDetail.trackingDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col">
                {STATUS_ORDER.map((status, index) => {
                  const reached = index <= currentIndex
                  const isLast = index === STATUS_ORDER.length - 1
                  return (
                    <li key={status} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "mt-1 size-3 shrink-0 rounded-full border",
                            reached
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}
                        />
                        {!isLast && (
                          <span
                            className={cn(
                              "h-9 w-px",
                              reached ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                      </div>
                      <div className={cn(isLast ? "" : "pb-8")}>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            reached ? "" : "text-muted-foreground"
                          )}
                        >
                          {statusLabel(t, status)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("orderDetail.items")}</CardTitle>
            <CardDescription>
              {itemCount === 1
                ? t("common.item", { count: itemCount })
                : t("common.items", { count: itemCount })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="size-14 shrink-0 overflow-hidden bg-muted">
                    {item.product?.image?.url ? (
                      <Image
                        src={item.product.image.url}
                        alt={item.name ?? item.product?.name ?? ""}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-xs font-semibold tracking-wider uppercase">
                      {item.name ?? item.product?.name ?? t("orders.product")}
                    </p>
                    {item.variant && (
                      <p className="truncate text-[0.6875rem] text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatPrice(item.priceCents)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatPrice(item.priceCents * (item.quantity ?? 1))}
                  </span>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase">
                {t("checkout.subtotal")}
              </span>
              <span className="text-sm">
                {formatPrice(order.subtotalCents ?? order.totalCents)}
              </span>
            </div>
            {(order.discountCents ?? 0) > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  {t("checkout.discount")}
                </span>
                <span className="text-sm">
                  -{formatPrice(order.discountCents!)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase">
                {t("checkout.shipping")}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("common.free")}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase">
                {t("checkout.total")}
              </span>
              <span className="text-lg font-semibold">
                {formatPrice(order.totalCents)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <CardTitle>{t("orderDetail.shippingTitle")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <address className="flex flex-col gap-0.5 text-sm text-muted-foreground not-italic">
                <span className="font-semibold text-foreground">
                  {order.shippingFullName ?? t("orders.product")}
                </span>
                <span>
                  {order.shippingHouseNo}
                  {order.shippingRoad ? `, ${order.shippingRoad}` : ""}
                </span>
                <span>{order.shippingArea}</span>
                <span>
                  {order.shippingDistrict}, {order.shippingDivision}
                </span>
                <span>
                  {order.shippingPostalCode} ·{" "}
                  {order.shippingCountry ?? "Bangladesh"}
                </span>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <CardTitle>{t("checkout.contactTitle")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>
                {t("checkout.email")}:{" "}
                <span className="font-medium text-foreground">
                  {order.ownerEmail ?? t("auth.guestNoEmail")}
                </span>
              </span>
              <span>
                {t("checkout.phone")}:{" "}
                <span className="font-medium text-foreground">
                  {order.shippingPhone ?? "—"}
                </span>
              </span>
              <span>
                {t("checkout.paymentTitle")}:{" "}
                <span className="font-medium text-foreground">
                  {paymentLabel(t, order.paymentMethod)}
                </span>
              </span>
            </CardContent>
          </Card>
        </div>

        {canCancel && (
          <div className="flex flex-col gap-2">
            {cancelError && (
              <p className="text-sm text-destructive">{cancelError}</p>
            )}
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={cancelling}
              onClick={handleCancel}
            >
              {cancelling
                ? t("orderDetail.cancelling")
                : t("orderDetail.cancel")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
