"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminOrder, AdminProfile } from "@/lib/admin"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { STATUS_VARIANTS } from "@/lib/orders"

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

export function AdminRecentOrders({
  orders,
  profiles,
}: {
  orders: AdminOrder[]
  profiles: AdminProfile[]
}) {
  const { t, locale } = useI18n()

  const profileByOwner = new Map(
    profiles.map((profile) => [profile.ownerId, profile])
  )

  const recent = [...orders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8)

  if (recent.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("admin.recentOrders")}</CardTitle>
            <CardDescription>
              {t("admin.recentOrdersDescription")}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/${locale}/admin/orders`} />}
            nativeButton={false}
          >
            {t("admin.orders")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("orders.orderPrefix")}</TableHead>
              <TableHead>{t("admin.customer")}</TableHead>
              <TableHead>{t("admin.date")}</TableHead>
              <TableHead className="text-right">{t("admin.items")}</TableHead>
              <TableHead className="text-right">{t("admin.total")}</TableHead>
              <TableHead>{t("admin.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((order) => {
              const profile = profileByOwner.get(order.ownerId)
              const itemCount = (order.items ?? []).reduce(
                (sum, item) => sum + (item.quantity ?? 0),
                0
              )
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium uppercase">
                    {t("orders.orderPrefix")}
                    {order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {profile?.displayName ??
                      order.ownerId.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(
                      locale === "bn" ? "bn-BD" : "en-BD",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {itemCount}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatPrice(order.totalCents)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
                      {statusLabel(t, order.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
