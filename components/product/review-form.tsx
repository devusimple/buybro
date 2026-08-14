"use client"

import { useState, type FormEvent } from "react"
import { id, type User } from "@instantdb/react"

import { Field } from "@/components/profile/field"
import { RatingInput } from "@/components/product/rating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export function ReviewForm({
  productId,
  rating,
  reviewCount,
  user,
}: {
  productId: string
  rating: number | undefined
  reviewCount: number | undefined
  user: User | null
}) {
  const { t } = useI18n()
  const { data: purchaseData } = clientDb.useQuery({
    orderItems: {
      $: { where: { "product.id": productId } },
      order: {},
    },
  })
  const hasPurchased =
    user != null &&
    (purchaseData?.orderItems ?? []).some(
      (item) => item.order?.ownerId === user.id
    )
  const [name, setName] = useState(user?.email?.split("@")[0] ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [reviewRating, setReviewRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const reviewId = id()
      const currentCount = reviewCount ?? 0
      const nextCount = currentCount + 1
      const nextRating =
        Math.round(
          (((rating ?? 0) * currentCount + reviewRating) / nextCount) * 10
        ) / 10
      const tx = clientDb.tx.reviews[reviewId].create({
        authorName: name.trim(),
        authorEmail: email.trim() || undefined,
        rating: reviewRating,
        comment: comment.trim() || undefined,
        verified: hasPurchased || undefined,
        createdAt: Date.now(),
      })
      const chunk = tx.link({ product: productId })
      if (user) {
        chunk.link({ author: user.id })
      }
      await clientDb.transact([
        chunk,
        clientDb.tx.products[productId].update({
          rating: nextRating,
          reviewCount: nextCount,
        }),
      ])
      setSubmitted(true)
      setComment("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("product.reviewError"))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-primary/30 bg-muted/40 p-4">
        <p className="text-sm font-semibold">{t("product.reviewSuccess")}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 px-0 text-muted-foreground hover:bg-transparent"
          onClick={() => setSubmitted(false)}
        >
          {t("product.reviewAgain")}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("product.reviewName")} htmlFor="review-name">
          <Input
            id="review-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("product.reviewNamePlaceholder")}
          />
        </Field>
        <Field label={t("product.reviewEmail")} htmlFor="review-email">
          <Input
            id="review-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("product.reviewEmailPlaceholder")}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase">
          {t("product.reviewRating")}
        </label>
        <RatingInput
          value={reviewRating}
          onChange={setReviewRating}
          ariaLabel={(value) => t("product.reviewRatingAria", { value })}
        />
      </div>

      <Field label={t("product.reviewComment")} htmlFor="review-comment">
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={t("product.reviewCommentPlaceholder")}
          className="w-full min-w-0 resize-y border border-transparent border-b-input bg-transparent py-1 text-base outline-none focus-visible:border-b-ring md:text-sm"
        />
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? t("common.saving") : t("product.submitReview")}
      </Button>
    </form>
  )
}
