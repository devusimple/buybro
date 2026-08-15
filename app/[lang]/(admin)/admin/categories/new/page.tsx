"use client"

import { CategoryForm } from "@/components/admin/category-form"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCategory } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"

export default function NewCategoryPage() {
  const { data, isLoading } = clientDb.useQuery({
    categories: {
      products: {},
      parent: {},
      children: {},
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

  return (
    <CategoryForm categories={(data?.categories ?? []) as AdminCategory[]} />
  )
}
