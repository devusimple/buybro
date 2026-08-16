"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

import { ProductCard } from "@/components/product-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import type { Product, Wishlist } from "@/lib/types"

export function WishlistSection({ userId }: { userId: string }) {
  const { t, locale } = useI18n()
  const { data, isLoading } = clientDb.useQuery({
    wishlists: {
      $: { where: { ownerId: userId }, limit: 1 },
      products: {
        $: { where: { status: { $ne: "draft" } } },
        image: {},
        gallery: {},
        variants: {},
        category: { parent: { parent: {} } },
        collections: {},
      },
    },
  })

  const wishlist = (data?.wishlists?.[0] ?? null) as Wishlist | null
  const products = (wishlist?.products ?? []) as Product[]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("wishlist.title")}</CardTitle>
        <CardDescription>{t("wishlist.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Heart />
              </EmptyMedia>
              <EmptyTitle>{t("wishlist.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                <span>{t("wishlist.emptyDescription")} </span>
                <Link
                  href={`/${locale}`}
                  className="font-medium underline underline-offset-4"
                >
                  {t("orders.startShopping")}
                </Link>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
