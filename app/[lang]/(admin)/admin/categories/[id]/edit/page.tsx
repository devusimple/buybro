"use client"

import { useParams } from "next/navigation"

import { CategoryForm } from "@/components/admin/category-form"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCategory } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function EditCategoryPage() {
  const { t } = useI18n()
  const params = useParams<{ id: string }>()
  const categoryId = params.id
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

  const categories = (data?.categories ?? []) as AdminCategory[]
  const category = categories.find((item) => item.id === categoryId)

  if (!category) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.editCategory")}</CardTitle>
          <CardDescription>{t("product.notFound")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return <CategoryForm categories={categories} category={category} />
}
