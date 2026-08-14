"use client"

import { useState } from "react"

import { BannerCard } from "@/components/home/banner-card"
import { CategoryStrip } from "@/components/home/category-strip"
import { CollectionSection } from "@/components/home/collection-section"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import type { Banner, Category, Collection, Product } from "@/lib/types"

type FeedItem =
  | { type: "collection"; collection: Collection; products: Product[] }
  | { type: "banner"; banner: Banner }

function buildFeed(
  collections: Collection[],
  banners: Banner[],
  products: Product[],
  seed: number
): FeedItem[] {
  const items: FeedItem[] = []
  const collectionCount = collections.length
  const bannerCount = banners.length
  const total = collectionCount + bannerCount
  const step =
    bannerCount > 0 ? Math.max(1, Math.ceil(total / bannerCount)) : total + 1
  const phase = Math.floor(seed * step)
  const bannerPositions = new Set<number>()
  for (let index = 0; index < bannerCount; index++) {
    bannerPositions.add((phase + index * step) % total)
  }

  let bannerIndex = 0
  let collectionIndex = 0
  for (let i = 0; i < total; i++) {
    if (bannerPositions.has(i) && bannerIndex < bannerCount) {
      items.push({ type: "banner", banner: banners[bannerIndex] })
      bannerIndex += 1
    } else if (collectionIndex < collectionCount) {
      const collection = collections[collectionIndex]
      const collectionProducts = products.filter((product) =>
        product.collections?.some((linked) => linked.id === collection.id)
      )
      items.push({
        type: "collection",
        collection,
        products: collectionProducts,
      })
      collectionIndex += 1
    }
  }

  while (bannerIndex < bannerCount) {
    items.push({ type: "banner", banner: banners[bannerIndex] })
    bannerIndex += 1
  }
  while (collectionIndex < collectionCount) {
    const collection = collections[collectionIndex]
    const collectionProducts = products.filter((product) =>
      product.collections?.some((linked) => linked.id === collection.id)
    )
    items.push({ type: "collection", collection, products: collectionProducts })
    collectionIndex += 1
  }

  return items
}

export function Feed() {
  const { t } = useI18n()
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
    categories: {
      parent: {},
    },
    banners: {
      $: { order: { sortOrder: "asc" } },
      image: {},
    },
  })
  const [seed] = useState(() => Math.random())

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-48" />
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
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, cardIndex) => (
                <div key={cardIndex} className="flex w-40 flex-col gap-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {t("catalog.loadError", { message: error.message })}
      </p>
    )
  }

  const products = (data?.products ?? []) as Product[]
  const collections = (data?.collections ?? []) as Collection[]
  const categories = (data?.categories ?? []) as Category[]
  const banners = ((data?.banners ?? []) as Banner[]).filter(
    (banner) => banner.active !== false
  )

  const items = buildFeed(collections, banners, products, seed)

  return (
    <div className="flex flex-col gap-12">
      <CategoryStrip categories={categories} />
      {items.map((item) =>
        item.type === "banner" ? (
          <BannerCard key={`banner-${item.banner.id}`} banner={item.banner} />
        ) : (
          <CollectionSection
            key={`collection-${item.collection.id}`}
            slug={item.collection.slug}
            name={item.collection.name}
            description={item.collection.description}
            products={item.products}
          />
        )
      )}
    </div>
  )
}
