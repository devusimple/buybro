import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { Product } from "@/lib/types"

export const SORT_OPTIONS = [
  "newest",
  "price-asc",
  "price-desc",
  "rating",
  "discount",
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]

export function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
}

export const PRICE_BUCKETS = [
  0, 10_00, 25_00, 50_00, 100_00, 250_00, 500_00,
] as const

export type CatalogFilters = {
  sort: SortOption
  maxPriceCents: number | null
  minRating: number | null
  inStockOnly: boolean
  discountedOnly: boolean
  variantValues: string[]
}

export const DEFAULT_FILTERS: CatalogFilters = {
  sort: "newest",
  maxPriceCents: null,
  minRating: null,
  inStockOnly: false,
  discountedOnly: false,
  variantValues: [],
}

export function isDiscounted(product: Product) {
  return (
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents
  )
}

export function productInStock(product: Product) {
  if (product.inStock === false) {
    return false
  }
  if (product.stock != null && product.stock <= 0) {
    return false
  }
  const variants = product.variants ?? []
  if (variants.length > 0 && variants.every((variant) => variant.stock === 0)) {
    return false
  }
  return true
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  const {
    maxPriceCents,
    minRating,
    inStockOnly,
    discountedOnly,
    variantValues,
  } = filters
  return products.filter((product) => {
    if (maxPriceCents != null && product.priceCents > maxPriceCents) {
      return false
    }
    if (minRating != null && (product.rating ?? 0) < minRating) {
      return false
    }
    if (inStockOnly && !productInStock(product)) {
      return false
    }
    if (discountedOnly && !isDiscounted(product)) {
      return false
    }
    if (variantValues.length > 0) {
      const values = new Set(
        (product.variants ?? []).map((variant) => variant.value)
      )
      if (!variantValues.some((value) => values.has(value))) {
        return false
      }
    }
    return true
  })
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceCents - b.priceCents)
    case "price-desc":
      return sorted.sort((a, b) => b.priceCents - a.priceCents)
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    case "discount":
      return sorted.sort((a, b) => {
        const aPercent = isDiscounted(a)
          ? (a.compareAtPriceCents! - a.priceCents) / a.compareAtPriceCents!
          : 0
        const bPercent = isDiscounted(b)
          ? (b.compareAtPriceCents! - b.priceCents) / b.compareAtPriceCents!
          : 0
        return bPercent - aPercent
      })
    case "newest":
    default:
      return sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }
}

export function availableVariantValues(products: Product[]): {
  title: string
  value: string
}[] {
  const seen = new Set<string>()
  const result: { title: string; value: string }[] = []
  for (const product of products) {
    for (const variant of product.variants ?? []) {
      const key = `${variant.title}\u0000${variant.value}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ title: variant.title, value: variant.value })
      }
    }
  }
  return result
}

export function filtersToSearchParams(filters: CatalogFilters) {
  const params = new URLSearchParams()
  if (filters.sort !== DEFAULT_FILTERS.sort) {
    params.set("sort", filters.sort)
  }
  if (filters.maxPriceCents != null) {
    params.set("maxPrice", String(filters.maxPriceCents))
  }
  if (filters.minRating != null) {
    params.set("minRating", String(filters.minRating))
  }
  if (filters.inStockOnly) {
    params.set("inStock", "1")
  }
  if (filters.discountedOnly) {
    params.set("discount", "1")
  }
  if (filters.variantValues.length > 0) {
    params.set("variants", filters.variantValues.join(","))
  }
  return params
}

export function useCatalogFilters(base?: string) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = parse(searchParams)
  const href = base ?? pathname

  const setFilters = useCallback(
    (next: CatalogFilters, retain?: string[]) => {
      const params = filtersToSearchParams(next)
      const keep = retain ?? ["q"]
      for (const key of keep) {
        const value = searchParams.get(key)
        if (value) {
          params.set(key, value)
        }
      }
      const qs = params.toString()
      router.replace(qs ? `${href}?${qs}` : href, { scroll: false })
    },
    [href, router, searchParams]
  )

  return { filters, setFilters }
}

function parse(params: URLSearchParams): CatalogFilters {
  const sort = params.get("sort")
  const maxPrice = params.get("maxPrice")
  const minRating = params.get("minRating")
  const inStockOnly = params.get("inStock") === "1"
  const discountedOnly = params.get("discount") === "1"
  const variantValues = params.get("variants")?.split(",").filter(Boolean) ?? []

  return {
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
    maxPriceCents: maxPrice ? Number(maxPrice) || null : null,
    minRating: minRating ? Number(minRating) || null : null,
    inStockOnly,
    discountedOnly,
    variantValues,
  }
}
