"use client"

import { useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { id, type User } from "@instantdb/react"

import { Field } from "@/components/profile/field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { AdminBanner } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined
}

export function BannerFormDialog({
  open,
  onOpenChange,
  banner,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: AdminBanner | null
  user: User
}) {
  const { t, locale } = useI18n()
  const [title, setTitle] = useState(banner?.title ?? "")
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "")
  const [ctaLabel, setCtaLabel] = useState(banner?.ctaLabel ?? "")
  const [ctaHref, setCtaHref] = useState(banner?.ctaHref ?? "")
  const [sortOrder, setSortOrder] = useState(
    banner?.sortOrder != null ? String(banner.sortOrder) : ""
  )
  const [active, setActive] = useState(banner?.active !== false)
  const [file, setFile] = useState<File | null>(null)
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const previewUrl = file ? thumbUrl : (banner?.image?.url ?? null)
  const previewHref = ctaHref ? `/${locale}${ctaHref}` : `/${locale}`

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) {
      setError(t("admin.saveError"))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaHref: ctaHref.trim() || undefined,
        sortOrder: toNumber(sortOrder),
        active,
      }

      let thumbnailId: string | undefined
      if (file) {
        const path = `${user.id}/admin/banners/thumb-${Date.now()}-${file.name}`
        const { data: fileData } = await clientDb.storage.uploadFile(
          path,
          file,
          {
            contentType: file.type,
          }
        )
        thumbnailId = fileData.id
      }

      const txs: unknown[] = []
      if (banner) {
        const chunk = clientDb.tx.banners[banner.id].update(payload)
        if (thumbnailId) {
          chunk.link({ image: thumbnailId })
        }
        txs.push(chunk)
        if (thumbnailId && banner.image) {
          txs.push(clientDb.tx.$files[banner.image.id].delete())
        }
      } else {
        const bannerId = id()
        const chunk = clientDb.tx.banners[bannerId].create(payload)
        if (thumbnailId) {
          chunk.link({ image: thumbnailId })
        }
        txs.push(chunk)
      }

      await clientDb.transact(txs as Parameters<typeof clientDb.transact>[0])
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {banner ? t("admin.editBanner") : t("admin.addBanner")}
          </DialogTitle>
          <DialogDescription>{t("admin.bannerFormHint")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="flex max-h-[min(65vh,36rem)] flex-col gap-5 overflow-y-auto pr-1">
              <Field
                label={t("admin.bannerTitle")}
                htmlFor="admin-banner-title"
              >
                <Input
                  id="admin-banner-title"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </Field>
              <Field
                label={t("admin.bannerSubtitle")}
                htmlFor="admin-banner-subtitle"
              >
                <Input
                  id="admin-banner-subtitle"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label={t("admin.bannerCtaLabel")}
                  htmlFor="admin-banner-cta-label"
                >
                  <Input
                    id="admin-banner-cta-label"
                    value={ctaLabel}
                    placeholder={t("admin.bannerCtaLabelPlaceholder")}
                    onChange={(event) => setCtaLabel(event.target.value)}
                  />
                </Field>
                <Field
                  label={t("admin.bannerCtaHref")}
                  htmlFor="admin-banner-cta-href"
                >
                  <Input
                    id="admin-banner-cta-href"
                    value={ctaHref}
                    placeholder="/products/headphones"
                    onChange={(event) => setCtaHref(event.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label={t("admin.bannerSortOrder")}
                  htmlFor="admin-banner-sort-order"
                >
                  <Input
                    id="admin-banner-sort-order"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                  />
                </Field>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                    />
                    {t("admin.active")}
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {t("admin.image")}
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="max-w-xs"
                    onChange={(event) => {
                      const selected = event.target.files?.[0] ?? null
                      if (selected) {
                        if (thumbUrl) {
                          URL.revokeObjectURL(thumbUrl)
                        }
                        setThumbUrl(URL.createObjectURL(selected))
                        setFile(selected)
                      }
                    }}
                  />
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (thumbUrl) {
                          URL.revokeObjectURL(thumbUrl)
                        }
                        setThumbUrl(null)
                        setFile(null)
                        if (fileRef.current) {
                          fileRef.current.value = ""
                        }
                      }}
                    >
                      {t("common.cancel")}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("admin.bannerImageHint")}
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => onOpenChange(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? t("common.saving")
                    : banner
                      ? t("common.saveChanges")
                      : t("admin.addBanner")}
                </Button>
              </DialogFooter>
            </div>

            <div className="flex flex-col gap-3 lg:sticky lg:top-0 lg:self-start">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t("admin.bannerLivePreview")}
              </p>
              <div className="relative aspect-[5/2] w-full overflow-hidden rounded-lg bg-muted">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-muted to-muted-foreground/20 px-4 text-center">
                    <p className="text-lg font-semibold text-foreground/80">
                      {title || t("admin.bannerTitle")}
                    </p>
                    {subtitle && (
                      <p className="text-sm text-foreground/60">{subtitle}</p>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-end p-4 sm:p-6">
                  {ctaLabel && (
                    <Button type="button" variant="secondary" size="sm">
                      {ctaLabel}
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {t("admin.bannerCtaHref")}: {previewHref}
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
