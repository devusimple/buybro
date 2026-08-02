"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, Pencil, Plus, Trash2 } from "lucide-react"

import { ProductFormDialog } from "@/components/admin/product-form"
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
import type { AdminCategory, AdminCollection, AdminProduct } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export default function AdminProductsPage() {
  const { t } = useI18n()
  const { user } = clientDb.useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    products: {
      $: { order: { createdAt: "desc" } },
      category: {},
      image: {},
      collections: {},
    },
    categories: {},
    collections: {
      $: { order: { sortOrder: "asc" } },
    },
  })

  const products = (data?.products ?? []) as AdminProduct[]
  const categories = (data?.categories ?? []) as AdminCategory[]
  const collections = (data?.collections ?? []) as AdminCollection[]

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(product: AdminProduct) {
    setEditing(product)
    setDialogOpen(true)
  }

  async function handleDelete(product: AdminProduct) {
    if (confirmDeleteId !== product.id) {
      setConfirmDeleteId(product.id)
      setError(null)
      return
    }
    setError(null)
    try {
      await clientDb.transact(clientDb.tx.products[product.id].delete())
      if (product.image) {
        await clientDb.transact(clientDb.tx.$files[product.image.id].delete())
      }
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
              <CardTitle>{t("admin.productsTitle")}</CardTitle>
              <CardDescription>
                {t("admin.productsDescription")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus data-icon="inline-start" />
              {t("admin.addProduct")}
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
          ) : products.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Package />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noProducts")}</EmptyTitle>
                <EmptyDescription>{t("admin.noProductsHint")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-border/60">
              {products.map((product) => {
                const confirming = confirmDeleteId === product.id
                return (
                  <li key={product.id} className="flex items-center gap-4 py-4">
                    <div className="size-14 shrink-0 overflow-hidden bg-muted">
                      {product.image?.url ? (
                        <Image
                          src={product.image.url}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {product.inStock
                            ? t("admin.inStock")
                            : t("product.outOfStock")}
                        </Badge>
                        {product.featured && (
                          <Badge variant="outline" className="shrink-0">
                            {t("admin.featured")}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        /{product.slug}
                        {product.category
                          ? ` · ${product.category.name}`
                          : ` · ${t("admin.uncategorized")}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          !product.inStock &&
                            "text-muted-foreground line-through"
                        )}
                      >
                        {formatPrice(product.priceCents)}
                      </span>
                      <div className="flex items-center gap-2">
                        {confirming ? (
                          <>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product)}
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
                          <>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t("admin.editProduct")}
                              onClick={() => openEdit(product)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive"
                              aria-label={t("admin.deleteProduct")}
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {user && (
        <ProductFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          categories={categories}
          collections={collections}
          product={editing}
          user={user}
        />
      )}
    </>
  )
}
