"use client"

import { useParams } from "next/navigation"

import { CouponForm } from "@/components/admin/coupon-form"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCoupon } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function EditCouponPage() {
  const { t } = useI18n()
  const params = useParams<{ id: string }>()
  const couponId = params.id
  const { data, isLoading } = clientDb.useQuery({
    coupons: {
      $: { where: { id: couponId } },
    },
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const coupon = (data?.coupons ?? [])[0] as AdminCoupon | undefined

  if (!coupon) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.editCoupon")}</CardTitle>
          <CardDescription>{t("product.notFound")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return <CouponForm coupon={coupon} />
}
