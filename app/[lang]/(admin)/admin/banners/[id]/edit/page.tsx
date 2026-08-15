"use client"

import { useParams } from "next/navigation"

import { BannerForm } from "@/components/admin/banner-form"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminBanner } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function EditBannerPage() {
  const { t } = useI18n()
  const params = useParams<{ id: string }>()
  const bannerId = params.id
  const { user, isLoading: authLoading } = clientDb.useAuth()
  const { data, isLoading } = clientDb.useQuery({
    banners: {
      $: { where: { id: bannerId } },
      image: {},
    },
  })

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const banner = (data?.banners ?? [])[0] as AdminBanner | undefined

  if (!banner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.editBanner")}</CardTitle>
          <CardDescription>{t("product.notFound")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return <BannerForm banner={banner} user={user} />
}
