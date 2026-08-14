"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Clock, Search, TrendingUp, X } from "lucide-react"

import { FilterBar } from "@/components/catalog/filter-bar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  availableVariantValues,
  filterProducts,
  sortProducts,
  useCatalogFilters,
} from "@/lib/catalog"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { getRecentProductIds } from "@/lib/recent"
import {
  addRecentSearchTerm,
  clearRecentSearchTerms,
  getRecentSearchTerms,
} from "@/lib/search-history"
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
  const catalog = useCatalogFilters()

  const { data, isLoading, error } = clientDb.useQuery({
    products: {
      $: { order: { createdAt: "desc" } },
      image: {},
      gallery: {},
      variants: {},
      category: { parent: { parent: {} } },
      collections: {},
    },
    collections: {
      $: { order: { sortOrder: "asc" } },
    },
  })

  const [value, setValue] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  const [focused, setFocused] = useState(false)
  const [recentTerms, setRecentTerms] = useState<string[]>(() =>
    getRecentSearchTerms()
  )
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

  const base = useMemo(() => {
    if (!normalized) {
      return []
    }
    return products.filter((product) =>
      [product.name, product.description, product.category?.name, product.slug]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(normalized))
    )
  }, [products, normalized])

  const results = useMemo(
    () =>
      sortProducts(filterProducts(base, catalog.filters), catalog.filters.sort),
    [base, catalog.filters]
  )
  const variantOptions = useMemo(() => availableVariantValues(base), [base])

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

  const nameMatches = useMemo(() => {
    const term = value.trim().toLowerCase()
    if (!term) {
      return []
    }
    const seen = new Set<string>()
    const matches: string[] = []
    for (const product of products) {
      const lower = product.name.toLowerCase()
      if (lower.includes(term) && !seen.has(lower)) {
        seen.add(lower)
        matches.push(product.name)
        if (matches.length >= 6) {
          break
        }
      }
    }
    return matches
  }, [products, value])

  const matchingRecentTerms = useMemo(() => {
    const term = value.trim().toLowerCase()
    return recentTerms
      .filter((existing) => existing.toLowerCase().includes(term))
      .slice(0, 5)
  }, [recentTerms, value])

  function recordTerm(term: string) {
    addRecentSearchTerm(term)
    setRecentTerms(getRecentSearchTerms())
  }

  function handleSubmit(term: string) {
    recordTerm(term)
    handleChange(term)
    setFocused(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      recordTerm(value)
    }
  }

  function handleClearHistory() {
    clearRecentSearchTerms()
    setRecentTerms([])
  }

  function handleChange(next: string) {
    setValue(next)
    const params = new URLSearchParams()
    if (next) {
      params.set("q", next)
    }
    const sort = searchParams.get("sort")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const inStock = searchParams.get("inStock")
    const discount = searchParams.get("discount")
    const variants = searchParams.get("variants")
    for (const [key, value] of [
      ["sort", sort],
      ["maxPrice", maxPrice],
      ["minRating", minRating],
      ["inStock", inStock],
      ["discount", discount],
      ["variants", variants],
    ] as const) {
      if (value) {
        params.set(key, value)
      }
    }
    const qs = params.toString()
    router.replace(qs ? `/${locale}/search?${qs}` : `/${locale}/search`, {
      scroll: false,
    })
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
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              if (
                !event.currentTarget.parentElement?.contains(
                  event.relatedTarget as Node
                )
              ) {
                setFocused(false)
              }
            }}
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
          {focused &&
            value.trim() &&
            (nameMatches.length > 0 || matchingRecentTerms.length > 0) && (
              <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
                {nameMatches.length > 0 && (
                  <div className="flex flex-col p-1">
                    <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                      {t("search.suggestions")}
                    </p>
                    {nameMatches.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSubmit(name)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <TrendingUp className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {matchingRecentTerms.length > 0 && (
                  <div className="flex flex-col border-t border-border/60 p-1">
                    <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                      {t("search.recentTitle")}
                    </p>
                    {matchingRecentTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSubmit(term)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <Clock className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          {base.length > 0 && (
            <div className="border-y border-border/60 py-4">
              <FilterBar
                filters={catalog.filters}
                onChange={catalog.setFilters}
                variantOptions={variantOptions}
              />
            </div>
          )}
          {results.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-10">
              <h2 className="text-lg font-semibold uppercase">
                {base.length === 0
                  ? t("search.noResultsTitle")
                  : t("catalog.noResults")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {base.length === 0
                  ? t("search.noResultsDescription")
                  : t("catalog.reset")}
              </p>
              {base.length === 0 ? (
                <Button
                  render={<Link href={`/${locale}/categories`} />}
                  nativeButton={false}
                  variant="outline"
                >
                  {t("search.browseCatalog")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    catalog.setFilters({
                      sort: catalog.filters.sort,
                      maxPriceCents: null,
                      minRating: null,
                      inStockOnly: false,
                      discountedOnly: false,
                      variantValues: [],
                    })
                  }
                >
                  {t("catalog.reset")}
                </Button>
              )}
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
          {recentTerms.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight uppercase">
                  {t("search.recentTitle")}
                </h2>
                <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                  {t("search.clearHistory")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentTerms.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit(term)}
                  >
                    <Clock data-icon="inline-start" />
                    {term}
                  </Button>
                ))}
              </div>
            </section>
          )}
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
