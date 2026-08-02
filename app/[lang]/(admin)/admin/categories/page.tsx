"use client"

import { useState } from "react"
import { Pencil, Plus, Tags, Trash2 } from "lucide-react"

import { CategoryFormDialog } from "@/components/admin/category-form"
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
import type { AdminCategory } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function AdminCategoriesPage() {
  const { t } = useI18n()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = clientDb.useQuery({
    categories: {
      products: {},
      parent: {},
      children: {},
    },
  })

  const categories = (data?.categories ?? []) as AdminCategory[]

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(category: AdminCategory) {
    setEditing(category)
    setDialogOpen(true)
  }

  async function handleDelete(category: AdminCategory) {
    const productCount = category.products?.length ?? 0
    if (productCount > 0) {
      setError(t("admin.deleteCategoryBlocked"))
      return
    }
    if (confirmDeleteId !== category.id) {
      setConfirmDeleteId(category.id)
      setError(null)
      return
    }
    setError(null)
    try {
      await clientDb.transact(clientDb.tx.categories[category.id].delete())
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
              <CardTitle>{t("admin.categoriesTitle")}</CardTitle>
              <CardDescription>
                {t("admin.categoriesDescription")}
              </CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus data-icon="inline-start" />
              {t("admin.addCategory")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : categories.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Tags />
                </EmptyMedia>
                <EmptyTitle>{t("admin.noCategories")}</EmptyTitle>
                <EmptyDescription>
                  {t("admin.noCategoriesHint")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-border/60">
              {categories.map((category) => {
                const confirming = confirmDeleteId === category.id
                const productCount = category.products?.length ?? 0
                return (
                  <li
                    key={category.id}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-sm font-semibold tracking-wider uppercase">
                        {category.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        /{category.slug} ·{" "}
                        {productCount === 1
                          ? t("admin.productCount", { count: productCount })
                          : t("admin.productsCount", { count: productCount })}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {confirming ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category)}
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
                            aria-label={t("admin.editCategory")}
                            onClick={() => openEdit(category)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={t("admin.deleteCategory")}
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        category={editing}
      />
    </>
  )
}
