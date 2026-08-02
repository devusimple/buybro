"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { getRecentProductIds } from "@/lib/recent"
import type { Product } from "@/lib/types"

function SectionRow({
  title,
  products,
}: {
  title: string
  products: Product[]
}) {
  if (products.length === 0) {
    return null
  }
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight uppercase">
        {title}
      </h2>
      <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.slice(0, 10).map((product) => (
          <div key={product.id} className="h-full w-40 shrink-0 sm:w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

function SearchPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const { data, isLoading, error } = clientDb.useQuery({
    products: {
      $: { order: { createdAt: "desc" } },
      image: {},
      category: { parent: { parent: {} } },
      collections: {},
    },
    collections: {
      $: { order: { sortOrder: "asc" } },
    },
  })

  const [value, setValue] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (prevQuery !== query) {
    setPrevQuery(query)
    setValue(query)
  }

  const products = useMemo(() => (data?.products ?? []) as Product[], [data])
  const collections = useMemo(() => data?.collections ?? [], [data])
  const trending = collections.find(
    (collection) => collection.slug === "trending"
  )
  const bestSellers = collections.find(
    (collection) => collection.slug === "best-sellers"
  )

  const recentIds = useMemo(() => getRecentProductIds(), [])

  const normalized = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalized) {
      return []
    }
    return products.filter((product) =>
      [product.name, product.description, product.category?.name, product.slug]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(normalized))
    )
  }, [products, normalized])

  const suggestions = useMemo(() => {
    if (!trending) {
      return products.filter((product) => product.featured)
    }
    return products.filter((product) =>
      product.collections?.some((collection) => collection.id === trending.id)
    )
  }, [products, trending])

  const recents = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]))
    return recentIds
      .map((id) => byId.get(id))
      .filter((product): product is Product => Boolean(product))
  }, [products, recentIds])

  const topSellers = useMemo(() => {
    if (!bestSellers) {
      return products.slice(0, 8)
    }
    return products.filter((product) =>
      product.collections?.some(
        (collection) => collection.id === bestSellers.id
      )
    )
  }, [products, bestSellers])

  function handleChange(next: string) {
    setValue(next)
    router.replace(
      next
        ? `/${locale}/search?q=${encodeURIComponent(next)}`
        : `/${locale}/search`,
      { scroll: false }
    )
  }

  function handleClear() {
    setValue("")
    router.replace(`/${locale}/search`, { scroll: false })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("search.title")}
        </h1>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            placeholder={t("search.placeholder")}
            className="pr-10 pl-9"
            autoFocus
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("search.clear")}
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={handleClear}
            >
              <X />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-12 pt-10">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex w-40 flex-col gap-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="pt-10 text-sm text-destructive">
          {t("catalog.loadError", { message: error.message })}
        </p>
      ) : normalized ? (
        <div className="pt-10">
          {results.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-10">
              <h2 className="text-lg font-semibold uppercase">
                {t("search.noResultsTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("search.noResultsDescription")}
              </p>
              <Button
                render={<Link href={`/${locale}/categories`} />}
                nativeButton={false}
                variant="outline"
              >
                {t("search.browseCatalog")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-12 pt-10">
          <SectionRow title={t("search.suggestions")} products={suggestions} />
          <SectionRow title={t("search.recentlyViewed")} products={recents} />
          <SectionRow title={t("search.topSellers")} products={topSellers} />
        </div>
      )}
    </div>
  )
}

export default function SearchPageRoute() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  )
}
