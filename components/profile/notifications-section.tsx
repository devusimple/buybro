"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Check, PackageCheck } from "lucide-react"
import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"
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
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Notification = InstaQLEntity<AppSchema, "notifications">

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

export function NotificationsSection({ userId }: { userId: string }) {
  const { t, locale } = useI18n()
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    notifications: {
      $: {
        where: { ownerId: userId },
        order: { createdAt: "desc" },
      },
    },
  })

  const notifications = (data?.notifications ?? []) as Notification[]

  async function markRead(notification: Notification) {
    setError(null)
    try {
      await clientDb.transact(
        clientDb.tx.notifications[notification.id].update({ read: true })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    }
  }

  async function markAllRead() {
    setError(null)
    try {
      const unread = notifications.filter((item) => !item.read)
      await clientDb.transact(
        unread.map((item) =>
          clientDb.tx.notifications[item.id].update({ read: true })
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    }
  }

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("notifications.title")}</CardTitle>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              <Check data-icon="inline-start" />
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>{t("notifications.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("notifications.emptyDescription")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {notifications.map((notification) => {
              const isOrderStatus = notification.type === "order-status"
              return (
                <li
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <PackageCheck
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      notification.read
                        ? "text-muted-foreground"
                        : "text-primary"
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {isOrderStatus ? (
                      <p className="text-sm">
                        {t("notifications.orderStatus", {
                          status: statusLabel(
                            t,
                            notification.status ?? "pending"
                          ),
                        })}
                        {notification.orderId && (
                          <span className="text-muted-foreground">
                            {" "}
                            · {t("orders.orderPrefix")}
                            {notification.orderId.slice(0, 8).toUpperCase()}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm">{t("notifications.general")}</p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString(
                        locale === "bn" ? "bn-BD" : "en-BD",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    {notification.orderId && (
                      <Link
                        href={`/${locale}/profile/orders/${notification.orderId}`}
                        className="w-fit text-xs font-medium text-primary underline underline-offset-4"
                      >
                        {t("notifications.viewOrder")}
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => markRead(notification)}
                    >
                      {t("notifications.markRead")}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
