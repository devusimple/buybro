"use client"

import { BannerForm } from "@/components/admin/banner-form"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"

export default function NewBannerPage() {
  const { user, isLoading: authLoading } = clientDb.useAuth()

  if (authLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <BannerForm user={user} />
}
