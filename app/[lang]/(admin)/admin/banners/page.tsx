"use client"

import { useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react"

import { BannerFormDialog } from "@/components/admin/banner-form"
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
import type { AdminBanner } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function AdminBannersPage() {
  const { t } = useI18n()
  const { user } = clientDb.useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminBanner | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    banners: {
      $: { order: { sortOrder: "asc" } },
      image: {},
    },
  })

  const banners = (data?.banners ?? []) as AdminBanner[]

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(banner: AdminBanner) {
    setEditing(banner)
    setDialogOpen(true)
  }

  async function toggleActive(banner: AdminBanner) {
    setError(null)
    try {
      await clientDb.transact(
        clientDb.tx.banners[banner.id].update({
          active: banner.active === false,
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.updateError"))
    }
  }

  async function handleDelete(banner: AdminBanner) {
    if (confirmDeleteId !== banner.id) {
      setConfirmDeleteId(banner.id)
      setError(null)
      return
    }
    setError(null)
    try {
      const txs: unknown[] = [clientDb.tx.banners[banner.id].delete()]
      if (banner.image) {
        txs.push(clientDb.tx.$files[banner.image.id].delete())
      }
      await clientDb.transact(txs as Parameters<typeof clientDb.transact>[0])
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.deleteError"))
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{t("admin.bannersTitle")}</CardTitle>
              <CardDescription>{t("admin.bannersDescription")}</CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus data-icon="inline-start" />
              {t("admin.addBanner")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : banners.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noBanners")}</EmptyTitle>
                <EmptyDescription>{t("admin.noBannersHint")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-border/60">
              {banners.map((banner) => {
                const confirming = confirmDeleteId === banner.id
                const isActive = banner.active !== false
                return (
                  <li key={banner.id} className="flex items-center gap-4 py-4">
                    <div className="aspect-[5/2] w-28 shrink-0 overflow-hidden bg-muted">
                      {banner.image?.url ? (
                        <Image
                          src={banner.image.url}
                          alt={banner.title}
                          width={112}
                          height={45}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {banner.title}
                        </p>
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className="shrink-0"
                        >
                          {isActive ? t("admin.active") : t("admin.inactive")}
                        </Badge>
                        {banner.sortOrder != null && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            #{banner.sortOrder}
                          </span>
                        )}
                      </div>
                      {banner.subtitle && (
                        <p className="truncate text-xs text-muted-foreground">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.ctaLabel && (
                        <p className="truncate text-xs text-muted-foreground">
                          {banner.ctaLabel}
                          {banner.ctaHref ? ` → ${banner.ctaHref}` : ""}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant={isActive ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => toggleActive(banner)}
                      >
                        {isActive ? t("admin.deactivate") : t("admin.activate")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t("admin.editBanner")}
                        onClick={() => openEdit(banner)}
                      >
                        <Pencil />
                      </Button>
                      {confirming ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(banner)}
                        >
                          {t("admin.confirm")}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          aria-label={t("admin.deleteBanner")}
                          onClick={() => handleDelete(banner)}
                        >
                          <Trash2 />
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

      {user && (
        <BannerFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          banner={editing}
          user={user}
        />
      )}
    </>
  )
}
