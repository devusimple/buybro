"use client"

import { SlidersHorizontal, X } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  DEFAULT_FILTERS,
  isSortOption,
  type CatalogFilters,
  type SortOption,
} from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"
import { formatPrice } from "@/lib/format"

const RATING_OPTIONS = [4, 3]

export function FilterBar({
  filters,
  onChange,
  variantOptions,
  showFilters = true,
}: {
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
  variantOptions: { title: string; value: string }[]
  showFilters?: boolean
}) {
  const { t } = useI18n()

  const activeCount =
    (filters.maxPriceCents != null ? 1 : 0) +
    (filters.minRating != null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.discountedOnly ? 1 : 0) +
    filters.variantValues.length

  function update(patch: Partial<CatalogFilters>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            {t("catalog.sort")}
          </span>
        </div>
        <Select
          value={filters.sort}
          onValueChange={(value) => {
            if (value !== null && isSortOption(value)) {
              update({ sort: value })
            }
          }}
        >
          <SelectTrigger
            className="flex w-48 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
            size="sm"
            aria-label={t("catalog.sort")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              [
                ["newest", "catalog.sortNewest"],
                ["price-asc", "catalog.sortPriceAsc"],
                ["price-desc", "catalog.sortPriceDesc"],
                ["rating", "catalog.sortRating"],
                ["discount", "catalog.sortDiscount"],
              ] as [SortOption, string][]
            ).map(([value, key]) => (
              <SelectItem key={value} value={value}>
                {t(key as "catalog.sortNewest")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showFilters && (
          <div className="ml-auto flex items-center gap-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={() => onChange(DEFAULT_FILTERS)}
              >
                <X />
                {t("catalog.clearFilters")}
              </Button>
            )}
            <span className="text-xs text-muted-foreground">
              {t("catalog.activeFilters", { count: activeCount })}
            </span>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="catalog-in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                update({ inStockOnly: checked === true })
              }
            />
            <Label htmlFor="catalog-in-stock">{t("catalog.inStock")}</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="catalog-discounted"
              checked={filters.discountedOnly}
              onCheckedChange={(checked) =>
                update({ discountedOnly: checked === true })
              }
            />
            <Label htmlFor="catalog-discounted">
              {t("catalog.discounted")}
            </Label>
          </div>

          <Select
            value={filters.minRating?.toString() ?? "all"}
            onValueChange={(value) => {
              if (value !== null) {
                update({
                  minRating: value === "all" ? null : Number(value) || null,
                })
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label={t("catalog.minRating")}
            >
              <SelectValue placeholder={t("catalog.anyRating")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("catalog.anyRating")}</SelectItem>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {t("catalog.ratingAndUp", { rating })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.maxPriceCents?.toString() ?? "all"}
            onValueChange={(value) => {
              if (value !== null) {
                update({
                  maxPriceCents: value === "all" ? null : Number(value) || null,
                })
              }
            }}
          >
            <SelectTrigger
              className="flex w-44 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label={t("catalog.maxPrice")}
            >
              <SelectValue placeholder={t("catalog.anyPrice")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("catalog.anyPrice")}</SelectItem>
              {[10_00, 25_00, 50_00, 100_00, 250_00, 500_00].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  {t("catalog.underPrice", { price: formatPrice(price) })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showFilters && variantOptions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold tracking-widest uppercase">
            {t("catalog.variants")}
          </p>
          <ToggleGroup
            value={filters.variantValues}
            onValueChange={(values) => update({ variantValues: values })}
            className="flex flex-wrap justify-start gap-1.5"
          >
            {variantOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                variant="outline"
                className={cn(
                  "rounded-sm px-2 py-1 text-xs",
                  filters.variantValues.includes(option.value) &&
                    "border-primary text-primary"
                )}
              >
                {option.title}: {option.value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}
    </div>
  )
}
