"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

import { FilterBar } from "@/components/catalog/filter-bar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  availableVariantValues,
  filterProducts,
  sortProducts,
  useCatalogFilters,
} from "@/lib/catalog"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import type { Product } from "@/lib/types"

export default function CollectionPageRoute() {
  return (
    <Suspense fallback={null}>
      <CollectionPage />
    </Suspense>
  )
}

function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useI18n()
  const { filters, setFilters } = useCatalogFilters()

  const { data, isLoading, error } = clientDb.useQuery({
    collections: {
      $: { where: { slug } },
      products: {
        $: { where: { status: { $ne: "draft" } } },
        image: {},
        gallery: {},
        variants: {},
        category: { parent: { parent: {} } },
      },
    },
  })

  const collection = data?.collections?.[0]

  const { base, visible, variantOptions } = useMemo(() => {
    const products = (collection?.products ?? []) as Product[]
    return {
      base: products,
      visible: sortProducts(filterProducts(products, filters), filters.sort),
      variantOptions: availableVariantValues(products),
    }
  }, [collection, filters])

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
          {t("collections.loadError", { message: error.message })}
        </p>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
        <h1 className="text-2xl font-semibold uppercase">
          {t("product.notFound")}
        </h1>
        <Button
          render={<Link href={`/${locale}`} />}
          nativeButton={false}
          variant="outline"
        >
          <ArrowLeft data-icon="inline-start" />
          {t("collections.backToShop")}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Button
        render={<Link href={`/${locale}`} />}
        nativeButton={false}
        variant="ghost"
        size="sm"
        className="mb-6 px-0"
      >
        <ArrowLeft data-icon="inline-start" />
        {t("collections.backToShop")}
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase sm:text-3xl">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-sm text-muted-foreground">
            {collection.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {t("common.items", { count: base.length })}
        </p>
      </div>

      {base.length > 0 && (
        <div className="mt-8 border-y border-border/60 py-4">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            variantOptions={variantOptions}
          />
        </div>
      )}

      {base.length === 0 ? (
        <div className="flex flex-col gap-2 py-16">
          <h2 className="text-lg font-semibold uppercase">
            {t("collections.emptyTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("collections.emptyDescription")}
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col gap-2 py-16">
          <h2 className="text-lg font-semibold uppercase">
            {t("catalog.noResults")}
          </h2>
          <Button
            render={<Link href={`/${locale}/collections/${collection.slug}`} />}
            nativeButton={false}
            variant="outline"
            className="self-start"
          >
            {t("catalog.reset")}
          </Button>
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
