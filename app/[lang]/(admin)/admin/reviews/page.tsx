"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, MessageSquareText, Star, Trash2 } from "lucide-react"
import { type InstaQLEntity } from "@instantdb/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import type { AppSchema } from "@/instant.schema"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { nowTimestamp } from "@/lib/time"
import { cn } from "@/lib/utils"

/* eslint-disable @typescript-eslint/no-empty-object-type */
type AdminReviewWithProduct = InstaQLEntity<
  AppSchema,
  "reviews",
  { product: { image: {} }; media: {} }
>
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default function AdminReviewsPage() {
  const { t, locale } = useI18n()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({})
  const [replyBusy, setReplyBusy] = useState(false)

  const { data, isLoading } = clientDb.useQuery({
    reviews: {
      $: { order: { createdAt: "desc" } },
      product: { image: {} },
      media: {},
    },
  })

  const reviews = (data?.reviews ?? []) as AdminReviewWithProduct[]

  async function handleReply(review: AdminReviewWithProduct) {
    const text = (replyDraft[review.id] ?? "").trim()
    const repliedAt = nowTimestamp()
    setReplyBusy(true)
    setError(null)
    try {
      await clientDb.transact(
        clientDb.tx.reviews[review.id].update({
          adminReply: text || null,
          adminReplyAt: text ? repliedAt : undefined,
        })
      )
      setReplyingId(null)
      setReplyDraft((drafts) => ({ ...drafts, [review.id]: text }))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.updateError"))
    } finally {
      setReplyBusy(false)
    }
  }

  async function handleDelete(review: AdminReviewWithProduct) {
    if (confirmDeleteId !== review.id) {
      setConfirmDeleteId(review.id)
      setError(null)
      return
    }
    setError(null)
    try {
      await clientDb.transact(clientDb.tx.reviews[review.id].delete())
      for (const file of review.media ?? []) {
        await clientDb.transact(clientDb.tx.$files[file.id].delete())
      }
      const product = review.product
      if (product && product.reviewCount != null && product.rating != null) {
        const oldCount = product.reviewCount
        const nextCount = Math.max(oldCount - 1, 0)
        const nextRating =
          nextCount > 0
            ? Math.round(
                ((product.rating * oldCount - review.rating) / nextCount) * 10
              ) / 10
            : 0
        await clientDb.transact(
          clientDb.tx.products[product.id].update({
            reviewCount: nextCount,
            rating: nextRating,
          })
        )
      }
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.deleteError"))
    }
  }

  function recencyLabel(createdAt: number) {
    return new Date(createdAt).toLocaleDateString(
      locale === "bn" ? "bn-BD" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1.5">
          <CardTitle>{t("admin.reviewsTitle")}</CardTitle>
          <CardDescription>{t("admin.reviewsDescription")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : reviews.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareText />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noReviews")}</EmptyTitle>
              <EmptyDescription>{t("admin.noReviewsHint")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {t("admin.reviewCount", { count: reviews.length })}
            </p>
            <ul className="flex flex-col divide-y divide-border/60">
              {reviews.map((review) => {
                const confirming = confirmDeleteId === review.id
                return (
                  <li
                    key={review.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">
                          {review.authorName}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={cn(
                                "size-3",
                                index < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/40"
                              )}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-primary/40 text-primary"
                          >
                            <BadgeCheck className="size-3" />
                            {t("product.verifiedPurchase")}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {recencyLabel(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                      {(review.media ?? []).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {review.media!.map((file) =>
                            /\.(mp4|webm|mov|ogg|m4v)$/i.test(file.url) ? (
                              <video
                                key={file.id}
                                src={file.url}
                                controls
                                preload="metadata"
                                className="size-16 bg-muted object-cover"
                              />
                            ) : (
                              <Image
                                key={file.id}
                                src={file.url}
                                alt={review.authorName}
                                width={64}
                                height={64}
                                className="size-16 bg-muted object-cover"
                              />
                            )
                          )}
                        </div>
                      )}
                      {review.product && (
                        <Link
                          href={`/${locale}/admin/products`}
                          className="mt-1 flex w-fit items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {review.product.image?.url ? (
                            <Image
                              src={review.product.image.url}
                              alt={review.product.name}
                              width={20}
                              height={20}
                              className="size-5 rounded-sm bg-muted object-cover"
                            />
                          ) : null}
                          <span className="truncate">
                            {review.product.name}
                            {review.authorEmail
                              ? ` · ${review.authorEmail}`
                              : ""}
                          </span>
                        </Link>
                      )}
                      {review.adminReply && (
                        <div className="mt-2 flex flex-col gap-1 rounded-lg bg-muted/60 p-3">
                          <p className="text-xs font-semibold text-primary">
                            {t("product.storeReply")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.adminReply}
                          </p>
                        </div>
                      )}
                      {replyingId === review.id && (
                        <div className="mt-2 flex flex-col gap-2">
                          <textarea
                            value={
                              replyDraft[review.id] ?? review.adminReply ?? ""
                            }
                            onChange={(event) =>
                              setReplyDraft((drafts) => ({
                                ...drafts,
                                [review.id]: event.target.value,
                              }))
                            }
                            rows={3}
                            placeholder={t("admin.replyPlaceholder")}
                            className="min-h-0 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-ring"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              disabled={replyBusy}
                              onClick={() => handleReply(review)}
                            >
                              {t("admin.saveReply")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReplyingId(null)}
                            >
                              {t("common.cancel")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingId((current) =>
                            current === review.id ? null : review.id
                          )
                          setError(null)
                        }}
                      >
                        <MessageSquareText data-icon="inline-start" />
                        {review.adminReply
                          ? t("admin.editReply")
                          : t("admin.reply")}
                      </Button>
                      {confirming ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(review)}
                          >
                            {t("admin.confirm")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            {t("common.cancel")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(review)}
                        >
                          <Trash2 data-icon="inline-start" />
                          {t("admin.deleteReview")}
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
