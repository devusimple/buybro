"use client"

import { useState } from "react"

import { clientDb } from "@/lib/clientDb"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useI18n } from "@/lib/i18n"

export function ProductGrid() {
  const { t } = useI18n()
  const { data, isLoading, error } = clientDb.useQuery({
    products: {
      $: { order: { createdAt: "desc" } },
      image: {},
      category: {},
    },
    categories: {},
  })
  const [selected, setSelected] = useState<string | null>(null)

  const products = data?.products ?? []
  const categories = data?.categories ?? []

  const visible = selected
    ? products.filter((product) => product.category?.slug === selected)
    : products

  return (
    <section id="categories" className="scroll-mt-24">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase">
            {t("catalog.title")}
          </h2>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={selected ? [selected] : ["all"]}
            onValueChange={(value) =>
              setSelected(value[0] === "all" ? null : value[0])
            }
            className="flex-wrap"
          >
            <ToggleGroupItem value="all">{t("common.all")}</ToggleGroupItem>
            {categories.map((category) => (
              <ToggleGroupItem key={category.id} value={category.slug}>
                {category.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {t("catalog.loadError", { message: error.message })}
          </p>
        )}

        {!isLoading && !error && visible.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("catalog.empty")}</p>
        )}

        {!isLoading && !error && visible.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
