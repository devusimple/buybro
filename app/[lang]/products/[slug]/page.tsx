"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

import { clientDb } from "@/lib/clientDb"
import { useCartStore } from "@/lib/cart-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useI18n()

  const addItem = useCartStore((state) => state.addItem)

  const { data, isLoading, error } = clientDb.useQuery({
    products: {
      $: { where: { slug } },
      image: {},
      category: {},
    },
  })

  const product = data?.products?.[0]

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error || !product) {
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
          {t("product.backToShop")}
        </Button>
      </div>
    )
  }

  const isOnSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Button
        render={<Link href={`/${locale}`} />}
        nativeButton={false}
        variant="ghost"
        size="sm"
        className="mb-8 px-0"
      >
        <ArrowLeft data-icon="inline-start" />
        {t("product.backToShop")}
      </Button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image?.url ? (
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {t("common.noImage")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {product.category?.name ?? t("common.accessories")}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight uppercase sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(product.priceCents)}
            </span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPriceCents!)}
              </span>
            )}
            {isOnSale && (
              <Badge variant="destructive">{t("common.sale")}</Badge>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase">
              {product.inStock === false
                ? t("product.outOfStock")
                : t("product.inStock")}
            </p>
            <Button
              size="lg"
              disabled={product.inStock === false}
              onClick={() =>
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  compareAtPriceCents: product.compareAtPriceCents,
                  imageUrl: product.image?.url,
                })
              }
            >
              {t("product.addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
