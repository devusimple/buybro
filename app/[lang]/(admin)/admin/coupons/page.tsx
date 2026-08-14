"use client"

import { useState } from "react"
import { Pencil, Plus, TicketPercent, Trash2 } from "lucide-react"

import { CouponFormDialog } from "@/components/admin/coupon-form"
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
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCoupon } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

function formatDate(ms: number, locale: string) {
  return new Date(ms).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function AdminCouponsPage() {
  const { t, locale } = useI18n()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCoupon | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now] = useState(() => Date.now())

  const { data, isLoading } = clientDb.useQuery({
    coupons: {
      $: { order: { serverCreatedAt: "desc" } },
    },
  })

  const coupons = (data?.coupons ?? []) as AdminCoupon[]

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(coupon: AdminCoupon) {
    setEditing(coupon)
    setDialogOpen(true)
  }

  async function handleDelete(coupon: AdminCoupon) {
    if (confirmDeleteId !== coupon.id) {
      setConfirmDeleteId(coupon.id)
      setError(null)
      return
    }
    setError(null)
    try {
      await clientDb.transact(clientDb.tx.coupons[coupon.id].delete())
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.deleteError"))
    }
  }

  function valueLabel(coupon: AdminCoupon) {
    return coupon.discountType === "percent"
      ? `${coupon.value}%`
      : formatPrice(coupon.value)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{t("admin.couponsTitle")}</CardTitle>
              <CardDescription>{t("admin.couponsDescription")}</CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus data-icon="inline-start" />
              {t("admin.addCoupon")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : coupons.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TicketPercent />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noCoupons")}</EmptyTitle>
                <EmptyDescription>{t("admin.noCouponsHint")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-border/60">
              {coupons.map((coupon) => {
                const confirming = confirmDeleteId === coupon.id
                const expired =
                  coupon.expiresAt != null && coupon.expiresAt < now
                return (
                  <li key={coupon.id} className="flex items-center gap-4 py-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold tracking-wider uppercase">
                          {coupon.code}
                        </p>
                        {coupon.active === false ? (
                          <Badge variant="outline">{t("admin.inactive")}</Badge>
                        ) : expired ? (
                          <Badge variant="outline">{t("admin.expired")}</Badge>
                        ) : (
                          <Badge variant="secondary">{t("admin.active")}</Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {valueLabel(coupon)}
                        {coupon.minSubtotalCents != null &&
                          ` · min ${formatPrice(coupon.minSubtotalCents)}`}
                        {coupon.usageLimit != null &&
                          ` · ${t("admin.usageLimit")} ${coupon.usageLimit}`}
                        {coupon.expiresAt != null &&
                          ` · ${t("admin.expiresAt")} ${formatDate(
                            coupon.expiresAt,
                            locale
                          )}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {confirming ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(coupon)}
                          >
                            {t("admin.confirm")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            {t("common.cancel")}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t("admin.editCoupon")}
                            onClick={() => openEdit(coupon)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={t("admin.deleteCoupon")}
                            onClick={() => handleDelete(coupon)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={editing}
      />
    </>
  )
}
