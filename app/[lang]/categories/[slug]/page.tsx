"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import type { Category, Product } from "@/lib/types"

type CategoryRef =
  { slug: string; parent?: { id: string } | null } | null | undefined

function productInCategory(
  product: Product,
  category: Category,
  categoriesById: Map<string, Category>
): boolean {
  let current: CategoryRef = product.category
  for (let depth = 0; current && depth < 3; depth++) {
    if (current.slug === category.slug) {
      return true
    }
    current = current.parent
      ? (categoriesById.get(current.parent.id) ?? null)
      : null
  }
  return false
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useI18n()

  const { data, isLoading, error } = clientDb.useQuery({
    categories: {
      parent: {},
      children: {},
    },
    products: {
      image: {},
      gallery: {},
      variants: {},
      category: { parent: { parent: {} } },
      collections: {},
    },
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <p className="text-sm text-destructive">
          {t("categories.loadError", { message: error.message })}
        </p>
      </div>
    )
  }

  const categories = (data?.categories ?? []) as Category[]
  const products = (data?.products ?? []) as Product[]
  const category = categories.find((item) => item.slug === slug)

  if (!category) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
        <h1 className="text-2xl font-semibold uppercase">
          {t("categories.notFoundTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("categories.notFoundDescription")}
        </p>
        <Button
          render={<Link href={`/${locale}/categories`} />}
          nativeButton={false}
          variant="outline"
        >
          <ArrowLeft data-icon="inline-start" />
          {t("categories.allCategories")}
        </Button>
      </div>
    )
  }

  const categoriesById = new Map(categories.map((item) => [item.id, item]))
  const children = (category.children ?? []).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  const visible = products.filter((product) =>
    productInCategory(product, category, categoriesById)
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Button
        render={
          <Link
            href={
              category.parent
                ? `/${locale}/categories/${category.parent.slug}`
                : `/${locale}/categories`
            }
          />
        }
        nativeButton={false}
        variant="ghost"
        size="sm"
        className="mb-6 px-0"
      >
        <ArrowLeft data-icon="inline-start" />
        {category.parent?.name ?? t("categories.allCategories")}
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase sm:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {t("common.items", { count: visible.length })}
        </p>
      </div>

      {children.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          <h2 className="text-xs font-semibold tracking-widest uppercase">
            {t("categories.subcategories")}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {children.map((child) => (
              <Link key={child.id} href={`/${locale}/categories/${child.slug}`}>
                <Badge variant="outline" className="py-1">
                  {child.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex flex-col gap-2 py-16">
          <h2 className="text-lg font-semibold uppercase">
            {t("categories.emptyTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("categories.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
