"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import type { Product } from "@/lib/types"

const PER_ROW = 10

export function CollectionSection({
  slug,
  name,
  description,
  products,
}: {
  slug: string
  name: string
  description?: string | null
  products: Product[]
}) {
  const { t, locale } = useI18n()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-lg font-semibold tracking-tight uppercase">
            {name}
          </h2>
          {description && (
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Button
          render={<Link href={`/${locale}/collections/${slug}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {t("home.seeAll")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("catalog.empty")}</p>
      ) : (
        <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.slice(0, PER_ROW).map((product) => (
            <div key={product.id} className="h-full w-40 shrink-0 sm:w-48">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
