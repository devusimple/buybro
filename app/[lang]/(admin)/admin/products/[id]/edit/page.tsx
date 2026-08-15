"use client"

import { useParams } from "next/navigation"

import { ProductForm } from "@/components/admin/product-form"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminCategory, AdminCollection, AdminProduct } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function EditProductPage() {
  const { t } = useI18n()
  const params = useParams<{ id: string }>()
  const productId = params.id
  const { user, isLoading: authLoading } = clientDb.useAuth()
  const { data, isLoading } = clientDb.useQuery({
    products: {
      $: { where: { id: productId } },
      category: {},
      image: {},
      gallery: {},
      variants: {},
      collections: {},
      faqs: {},
    },
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

  const product = (data?.products ?? [])[0] as AdminProduct | undefined

  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.editProduct")}</CardTitle>
          <CardDescription>{t("product.notFound")}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProductForm
      categories={(data?.categories ?? []) as AdminCategory[]}
      collections={(data?.collections ?? []) as AdminCollection[]}
      product={product}
      user={user}
    />
  )
}
