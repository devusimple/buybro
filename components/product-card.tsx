"use client"

import Image from "next/image"
import Link from "next/link"

import { RatingStars } from "@/components/product/rating"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WishlistButton } from "@/components/wishlist/wishlist-button"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import type { Product } from "@/lib/types"
import { LucideShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n()
  const addItem = useCartStore((state) => state.addItem)
  const isOnSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents
  const discountPercent = isOnSale
    ? Math.round(
        ((product.compareAtPriceCents! - product.priceCents) /
          product.compareAtPriceCents!) *
          100
      )
    : 0
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? 0
  const isOutOfStock = product.stock != null && product.stock <= 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents,
      imageUrl: product.image?.url,
      stock: product.stock,
    })
  }

  return (
    <div className="relative flex h-full flex-col">
      <WishlistButton
        productId={product.id}
        className="absolute top-2 right-2 z-10"
      />
      <Card size="sm" className="h-full">
        <Link
          href={`/${locale}/products/${product.slug}`}
          aria-label={product.name}
          className="group/card flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.image?.url ? (
              <Image
                src={product.image.url}
                alt={product.name}
                width={800}
                height={800}
                className={cn(
                  "aspect-square h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105",
                  isOutOfStock && "opacity-60"
                )}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {t("common.noImage")}
              </div>
            )}
            {isOnSale && (
              <Badge
                variant="destructive"
                className="absolute top-0 left-0 bg-destructive px-2 py-1 tabular-nums"
              >
                {t("product.offPercent", { percent: discountPercent })}
              </Badge>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <span className="bg-background px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase shadow-sm">
                  {t("product.outOfStock")}
                </span>
              </div>
            )}
          </div>
          <CardContent className="flex flex-1 flex-col gap-1">
            <p className="truncate text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {product.category?.name ?? t("common.accessories")}
            </p>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold tracking-wider uppercase">
              {product.name}
            </h3>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold tabular-nums">
                {formatPrice(product.priceCents)}
              </span>
              {isOnSale && (
                <span className="text-xs text-muted-foreground tabular-nums line-through">
                  {formatPrice(product.compareAtPriceCents!)}
                </span>
              )}
            </p>
            {reviewCount > 0 && (
              <p className="flex items-center gap-1.5">
                <RatingStars value={rating} size="sm" />
                <span className="text-xs tabular-nums">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({reviewCount})
                </span>
              </p>
            )}
          </CardContent>
        </Link>
        <CardContent>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <LucideShoppingBag size={16} />
            {isOutOfStock ? t("product.outOfStock") : t("product.addToCart")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
