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

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
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
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group/card flex h-full flex-col"
      >
        <Card size="sm" className="h-full">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.image?.url ? (
              <Image
                src={product.image.url}
                alt={product.name}
                width={800}
                height={800}
                className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                {t("common.noImage")}
              </div>
            )}
            {isOnSale && (
              <Badge
                variant="destructive"
                className="absolute top-0 left-0 bg-destructive px-2 py-1"
              >
                {t("product.offPercent", { percent: discountPercent })}
              </Badge>
            )}
          </div>
          <CardContent className="flex flex-1 flex-col gap-1">
            <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {product.category?.name ?? t("common.accessories")}
            </p>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              {product.name}
            </h3>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold">
                {formatPrice(product.priceCents)}
              </span>
              {isOnSale && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPriceCents!)}
                </span>
              )}
            </p>
            {reviewCount > 0 && (
              <p className="flex items-center gap-1.5">
                <RatingStars value={rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-auto w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {t("product.addToCart")}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
