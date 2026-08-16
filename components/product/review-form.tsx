"use client"

import { useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { Camera, X } from "lucide-react"
import { id, type User } from "@instantdb/react"

import { Field } from "@/components/profile/field"
import { RatingInput } from "@/components/product/rating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

type MediaUpload = {
  file: File
  url: string
}

export function ReviewForm({
  productId,
  user,
}: {
  productId: string
  user: User
}) {
  const { t } = useI18n()
  const [name, setName] = useState(user?.email?.split("@")[0] ?? "")
  const [nameTouched, setNameTouched] = useState(false)
  const [email, setEmail] = useState(user?.email ?? "")
  const [reviewRating, setReviewRating] = useState(5)
  const [comment, setComment] = useState("")
  const [media, setMedia] = useState<MediaUpload[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRef = useRef<HTMLInputElement>(null)

  const { data: profileData } = clientDb.useQuery({
    profiles: { $: { where: { ownerId: user.id } } },
  })
  const profileName = profileData?.profiles?.[0]?.displayName
  const effectiveName = nameTouched || !profileName ? name : profileName

  function handleMediaFiles(selected: FileList | null) {
    const uploads = Array.from(selected ?? []).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    if (uploads.length > 0) {
      setMedia((current) => [...current, ...uploads])
    }
    if (mediaRef.current) {
      mediaRef.current.value = ""
    }
  }

  function removeMedia(index: number) {
    setMedia((current) => {
      const upload = current[index]
      if (upload) {
        URL.revokeObjectURL(upload.url)
      }
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const reviewId = id()
      const mediaIds: string[] = []
      if (media.length > 0) {
        for (const upload of media) {
          const path = `${user.id}/reviews/${reviewId}-${Date.now()}-${upload.file.name}`
          const { data: fileData } = await clientDb.storage.uploadFile(
            path,
            upload.file,
            { contentType: upload.file.type }
          )
          mediaIds.push(fileData.id)
        }
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: user.refresh_token,
          productId,
          rating: reviewRating,
          comment,
          authorName: effectiveName.trim(),
          authorEmail: email.trim() || undefined,
          mediaIds,
        }),
      })
      const data = await response.json()
      if (!data.ok) {
        setError(t(data.error ?? "product.reviewError"))
        return
      }
      setSubmitted(true)
      setComment("")
      setMedia((current) => {
        for (const upload of current) {
          URL.revokeObjectURL(upload.url)
        }
        return []
      })
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
            value={effectiveName}
            onChange={(event) => {
              setName(event.target.value)
              setNameTouched(true)
            }}
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

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase">
          {t("product.reviewMedia")}
        </label>
        {media.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {media.map((upload, index) => (
              <div
                key={upload.url}
                className="group relative aspect-square overflow-hidden bg-muted"
              >
                {upload.file.type.startsWith("image/") ? (
                  <Image
                    src={upload.url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="[display:-webkit-box] flex h-full items-center justify-center overflow-hidden p-1 text-center text-[0.625rem] tracking-widest text-ellipsis text-muted-foreground uppercase [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {upload.file.name}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={t("product.reviewRemoveMedia")}
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <Input
            ref={mediaRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="max-w-xs"
            onChange={(event) => handleMediaFiles(event.target.files)}
          />
          <Camera className="size-4 shrink-0 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("product.reviewMediaHint")}
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? t("common.saving") : t("product.submitReview")}
      </Button>
    </form>
  )
}
