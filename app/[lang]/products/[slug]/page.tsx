"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BadgeCheck } from "lucide-react"
import { useParams } from "next/navigation"

import { ProductCard } from "@/components/product-card"
import { RatingStars } from "@/components/product/rating"
import { ReviewForm } from "@/components/product/review-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartStore } from "@/lib/cart-store"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { addRecentProduct, getRecentProductIds } from "@/lib/recent"
import { sanitizeHtml } from "@/lib/sanitize"
import type { Product, Variant } from "@/lib/types"
import { cn } from "@/lib/utils"

const richTextClasses =
  "[&_a]:text-primary [&_a]:underline [&_a]:break-all [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:list-inside [&_ol]:mt-3 [&_ol]:list-decimal [&_ul]:mt-3 [&_ul]:list-disc [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p:not(:first-child)]:mt-3"

function ProductView({ slug }: { slug: string }) {
  const { t, locale } = useI18n()
  const { user } = clientDb.useAuth()
  const addItem = useCartStore((state) => state.addItem)

  const { data, isLoading, error } = clientDb.useQuery({
    products: {
      $: { where: { slug } },
      image: {},
      gallery: {},
      variants: {},
      category: {},
      reviews: {},
    },
  })

  const product = data?.products?.[0]

  const { data: catalogData } = clientDb.useQuery({
    products: {
      image: {},
      gallery: {},
      variants: {},
      category: { parent: { parent: {} } },
      collections: {},
    },
  })

  const catalogProducts = useMemo(
    () => (catalogData?.products ?? []) as Product[],
    [catalogData]
  )

  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }
    const categoryId = product.category?.id
    const sameCategory = categoryId
      ? catalogProducts.filter(
          (item) => item.id !== product.id && item.category?.id === categoryId
        )
      : []
    const others = catalogProducts.filter((item) => item.id !== product.id)
    return [...sameCategory, ...others]
      .filter(
        (item, index, arr) =>
          arr.findIndex((other) => other.id === item.id) === index
      )
      .slice(0, 10)
  }, [catalogProducts, product])

  const recentProducts = useMemo(() => {
    const byId = new Map(
      catalogProducts.map((item) => [item.id, item] as const)
    )
    return getRecentProductIds()
      .filter((id) => id !== product?.id)
      .map((id) => byId.get(id))
      .filter((item): item is Product => Boolean(item))
      .slice(0, 10)
  }, [catalogProducts, product])

  useEffect(() => {
    if (product) {
      addRecentProduct(product.id)
    }
  }, [product])

  const [activeImage, setActiveImage] = useState(0)

  const gallery = useMemo(
    () =>
      [product?.image, ...(product?.gallery ?? [])].filter(
        (image): image is Extract<typeof image, { url: string }> =>
          Boolean(image?.url)
      ),
    [product]
  )

  const variantGroups = useMemo(() => {
    const groups = new Map<string, Variant[]>()
    for (const variant of product?.variants ?? []) {
      const list = groups.get(variant.title) ?? []
      list.push(variant)
      groups.set(variant.title, list)
    }
    return groups
  }, [product])

  const variantTitles = Array.from(variantGroups.keys())

  const [selected, setSelected] = useState<Record<string, string>>({})
  const [prevVariantKey, setPrevVariantKey] = useState("")
  const variantKey =
    product?.id +
    Array.from(variantGroups.entries())
      .map(([title, list]) => `${title}:${list.map((v) => v.value).join("|")}`)
      .join(";")
  if (product && prevVariantKey !== variantKey) {
    setPrevVariantKey(variantKey)
    const defaults: Record<string, string> = {}
    for (const [title, list] of variantGroups) {
      defaults[title] =
        list.find((variant) => variant.stock !== 0)?.value ?? list[0].value
    }
    setSelected(defaults)
  }

  const selectedOptions = variantTitles.map((title) => {
    const value = selected[title] ?? variantGroups.get(title)?.[0]?.value ?? ""
    const variant = variantGroups
      .get(title)
      ?.find((item) => item.value === value)
    return { title, value, variant }
  })

  const singleGroupTitle = variantTitles.length === 1 ? variantTitles[0] : null
  const priceVariant = singleGroupTitle
    ? variantGroups
        .get(singleGroupTitle)
        ?.find((item) => item.value === selected[singleGroupTitle])
    : undefined

  const displayPrice = priceVariant?.priceCents ?? product?.priceCents ?? 0
  const selectedOutOfStock = selectedOptions.some(
    ({ variant }) => variant?.stock === 0
  )

  const selectedVariants = selectedOptions
    .map(({ variant }) => variant)
    .filter((variant): variant is Variant => Boolean(variant))
  const stockValues = [
    ...(product?.stock != null ? [product.stock] : []),
    ...selectedVariants
      .filter((variant) => variant.stock != null)
      .map((variant) => variant.stock!),
  ]
  const availableStock: number | undefined =
    stockValues.length > 0 ? Math.min(...stockValues) : undefined
  const productUnavailable =
    product?.inStock === false || (product?.stock != null && product.stock <= 0)
  const isOutOfStock = productUnavailable || selectedOutOfStock

  const variantLabel =
    variantTitles.length > 0
      ? variantTitles
          .map(
            (title) =>
              `${title}: ${selected[title] ?? variantGroups.get(title)?.[0]?.value}`
          )
          .join(", ")
      : undefined

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
    product.compareAtPriceCents > displayPrice
  const discountPercent = isOnSale
    ? Math.round(
        ((product.compareAtPriceCents! - displayPrice) /
          product.compareAtPriceCents!) *
          100
      )
    : 0

  const reviews = [...(product.reviews ?? [])].sort(
    (a, b) => b.createdAt - a.createdAt
  )
  const reviewCount = product.reviewCount ?? 0
  const rating = product.rating ?? 0

  const richHtml = product.richDescription
    ? sanitizeHtml(product.richDescription)
    : ""

  const activeGalleryImage = gallery[activeImage] ?? gallery[0]

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
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {activeGalleryImage?.url ? (
              <Image
                src={activeGalleryImage.url}
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
            {isOnSale && (
              <Badge
                variant="destructive"
                className="absolute top-4 left-4 bg-destructive"
              >
                {t("product.offPercent", { percent: discountPercent })}
              </Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden bg-muted transition-opacity",
                    index === activeImage
                      ? "ring-2 ring-primary"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
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
            {product.sku && (
              <p className="text-xs text-muted-foreground">
                {t("product.sku", { sku: product.sku })}
              </p>
            )}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars value={rating} />
                <span className="text-xs text-muted-foreground">
                  {rating.toFixed(1)} ·{" "}
                  {t(
                    reviewCount === 1
                      ? "product.reviewCountOne"
                      : "product.reviewCount",
                    { count: reviewCount }
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPriceCents!)}
              </span>
            )}
          </div>
          {!isOutOfStock && availableStock != null && availableStock <= 5 && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {t("product.lowStock", { count: availableStock })}
            </p>
          )}

          {variantTitles.length > 0 && (
            <div className="flex flex-col gap-4">
              {selectedOptions.map(({ title, value }) => (
                <div key={title} className="flex flex-col gap-2">
                  <p className="text-xs font-semibold tracking-widest uppercase">
                    {title}:{" "}
                    <span className="font-normal text-muted-foreground">
                      {value}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variantGroups.get(title)?.map((option) => {
                      const isSelected = option.value === value
                      const outOfStock = option.stock === 0
                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={outOfStock}
                          onClick={() =>
                            setSelected((current) => ({
                              ...current,
                              [title]: option.value,
                            }))
                          }
                          className={cn(
                            "rounded-md border px-4 py-1.5 text-sm transition-colors",
                            isSelected
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-muted-foreground/50",
                            outOfStock &&
                              "cursor-not-allowed opacity-40 hover:border-border"
                          )}
                        >
                          {option.value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm font-semibold tracking-widest uppercase">
            {isOutOfStock ? t("product.outOfStock") : t("product.inStock")}
          </p>

          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              disabled={isOutOfStock}
              onClick={() =>
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCents: displayPrice,
                  compareAtPriceCents: product.compareAtPriceCents,
                  imageUrl: activeGalleryImage?.url ?? product.image?.url,
                  variant: variantLabel,
                  variantId: selectedVariants[0]?.id,
                  stock: availableStock,
                })
              }
            >
              {t("product.addToCart")}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t("product.freeShippingNote")}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight uppercase">
            {t("product.description")}
          </h2>
          {richHtml ? (
            <div
              className={cn("flex flex-col gap-2 text-sm", richTextClasses)}
              dangerouslySetInnerHTML={{ __html: richHtml }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight uppercase">
                {t("product.reviews")}
              </h2>
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <RatingStars value={rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {t(
                      reviewCount === 1
                        ? "product.reviewCountOne"
                        : "product.reviewCount",
                      { count: reviewCount }
                    )}
                  </span>
                </div>
              )}
            </div>
            {reviews.length > 0 ? (
              <ul className="flex flex-col divide-y divide-border/60">
                {reviews.map((review) => (
                  <li key={review.id} className="flex flex-col gap-2 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">
                          {review.authorName}
                        </p>
                        {review.verified && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-primary/40 text-primary"
                          >
                            <BadgeCheck className="size-3" />
                            {t("product.verifiedPurchase")}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          locale === "bn" ? "bn-BD" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <RatingStars value={review.rating} size="sm" />
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("product.noReviews")}
              </p>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-tight uppercase">
              {t("product.writeReview")}
            </h3>
            <ReviewForm
              productId={product.id}
              rating={product.rating}
              reviewCount={product.reviewCount}
              user={user ?? null}
            />
          </div>
        </div>
      </section>

      <ProductRow title={t("product.related")} products={relatedProducts} />
      <ProductRow
        title={t("product.recentlyViewed")}
        products={recentProducts}
      />
    </div>
  )
}

function ProductRow({
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

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  return <ProductView key={slug} slug={slug} />
}
