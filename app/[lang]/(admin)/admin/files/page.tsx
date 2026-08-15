"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { File as FileIcon, Link2, Trash2 } from "lucide-react"

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
import type { AdminFile } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { isImageFile } from "@/lib/utils"

type Usage = {
  kind: "thumbnail" | "gallery" | "banner" | "review" | "avatar"
  title: string
  href: string
}

function usagesFor(file: AdminFile, locale: string): Usage[] {
  const usages: Usage[] = []
  for (const product of file.products ?? []) {
    usages.push({
      kind: "thumbnail",
      title: product.name,
      href: `/${locale}/admin/products/${product.id}/edit`,
    })
  }
  for (const product of file.productGallery ?? []) {
    usages.push({
      kind: "gallery",
      title: product.name,
      href: `/${locale}/admin/products/${product.id}/edit`,
    })
  }
  for (const banner of file.banners ?? []) {
    usages.push({
      kind: "banner",
      title: banner.title,
      href: `/${locale}/admin/banners/${banner.id}/edit`,
    })
  }
  for (const review of file.reviewMedia ?? []) {
    usages.push({
      kind: "review",
      title: review.authorName,
      href: `/${locale}/admin/reviews`,
    })
  }
  for (const profile of file.profiles ?? []) {
    usages.push({
      kind: "avatar",
      title: profile.displayName ?? profile.ownerId,
      href: `/${locale}/admin/users`,
    })
  }
  return usages
}

function usageLabel(t: ReturnType<typeof useI18n>["t"], kind: Usage["kind"]) {
  return {
    thumbnail: t("admin.usedAsThumbnail"),
    gallery: t("admin.usedInGallery"),
    banner: t("admin.usedInBanner"),
    review: t("admin.usedInReview"),
    avatar: t("admin.usedAsAvatar"),
  }[kind]
}

export default function AdminFilesPage() {
  const { t, locale } = useI18n()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    $files: {
      $: { order: { serverCreatedAt: "desc" } },
      products: {},
      productGallery: {},
      banners: {},
      reviewMedia: {},
      profiles: {},
    },
  })

  const files = (data?.$files ?? []) as AdminFile[]

  const [onlyUnused, setOnlyUnused] = useState(false)

  async function handleCopyUrl(file: AdminFile) {
    try {
      await navigator.clipboard.writeText(file.url)
      setCopiedId(file.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // ignore clipboard failures
    }
  }

  async function handleDelete(file: AdminFile) {
    if (confirmDeleteId !== file.id) {
      setConfirmDeleteId(file.id)
      setError(null)
      return
    }
    setError(null)
    try {
      await clientDb.transact(clientDb.tx.$files[file.id].delete())
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.deleteError"))
    }
  }

  const visible = onlyUnused
    ? files.filter((file) => usagesFor(file, locale).length === 0)
    : files

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{t("admin.filesTitle")}</CardTitle>
              <CardDescription>{t("admin.filesDescription")}</CardDescription>
            </div>
            <Button
              variant={onlyUnused ? "secondary" : "outline"}
              size="sm"
              onClick={() => setOnlyUnused((current) => !current)}
            >
              {onlyUnused ? t("admin.unused") : t("admin.inUse")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileIcon />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noFiles")}</EmptyTitle>
                <EmptyDescription>{t("admin.noFilesHint")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((file) => {
                const usages = usagesFor(file, locale)
                const confirming = confirmDeleteId === file.id
                const isImage = isImageFile(file.path, file.url)
                return (
                  <li
                    key={file.id}
                    className="flex flex-col gap-3 rounded-md border border-border p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative aspect-square size-16 shrink-0 overflow-hidden bg-muted">
                        {isImage ? (
                          <Image
                            src={file.url}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-muted-foreground">
                            <FileIcon className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p
                          className="truncate font-mono text-xs"
                          title={file.path}
                        >
                          {file.path}
                        </p>
                        {usages.length > 0 ? (
                          <Badge variant="secondary" className="w-fit">
                            {t("admin.inUse")} · {usages.length}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="w-fit">
                            {t("admin.unused")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {usages.length > 0 ? (
                        <p className="flex flex-col gap-1 text-xs">
                          {usages.slice(0, 3).map((usage, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-1.5"
                            >
                              <span className="text-muted-foreground">
                                {usageLabel(t, usage.kind)}:
                              </span>
                              <Link
                                href={usage.href}
                                className="truncate text-foreground underline underline-offset-4 hover:text-primary"
                              >
                                {usage.title}
                              </Link>
                            </span>
                          ))}
                          {usages.length > 3 && (
                            <span className="text-muted-foreground">
                              +{usages.length - 3} {t("admin.inUse")}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {t("admin.noUsage")}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t border-border pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopyUrl(file)}
                      >
                        <Link2 data-icon="inline-start" />
                        {copiedId === file.id
                          ? t("admin.urlCopied")
                          : t("admin.copyUrl")}
                      </Button>
                      {confirming ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(file)}
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
                          disabled={usages.length > 0}
                          title={
                            usages.length > 0
                              ? t("admin.deleteFileHint")
                              : undefined
                          }
                          onClick={() => handleDelete(file)}
                        >
                          <Trash2 data-icon="inline-start" />
                          {t("admin.deleteFile")}
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}
