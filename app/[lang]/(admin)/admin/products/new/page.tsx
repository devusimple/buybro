"use client"

import { ProductForm } from "@/components/admin/product-form"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCategory, AdminCollection } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"

export default function NewProductPage() {
  const { user, isLoading: authLoading } = clientDb.useAuth()
  const { data, isLoading } = clientDb.useQuery({
    categories: {},
    collections: {
      $: { order: { sortOrder: "asc" } },
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

  if (!user) {
    return null
  }

  return (
    <ProductForm
      categories={(data?.categories ?? []) as AdminCategory[]}
      collections={(data?.collections ?? []) as AdminCollection[]}
      user={user}
    />
  )
}
