"use client"

import { useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
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
import type { AdminCategory, AdminProduct } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  product,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: AdminCategory[]
  product?: AdminProduct | null
  user: User
}) {
  const { t } = useI18n()
  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(
    product ? String(product.priceCents / 100) : ""
  )
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? "")
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const currentImage = product?.image

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setError(null)
      setFile(null)
    }
    onOpenChange(next)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const priceCents = Math.round(parseFloat(price || "0") * 100)
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        priceCents,
        inStock,
        featured,
      }

      let fileId: string | undefined
      if (file) {
        const path = `${user.id}/admin/products/${Date.now()}-${file.name}`
        const { data: fileData } = await clientDb.storage.uploadFile(
          path,
          file,
          { contentType: file.type }
        )
        fileId = fileData.id
      }

      if (product) {
        const chunk = clientDb.tx.products[product.id].update(payload)
        if (categoryId) {
          chunk.link({ category: categoryId })
        } else if (product.category) {
          chunk.unlink({ category: product.category.id })
        }
        if (fileId) {
          chunk.link({ image: fileId })
        } else if (product.image && !file) {
          chunk.unlink({ image: product.image.id })
        }
        await clientDb.transact(chunk)
        if (fileId && product.image) {
          await clientDb.transact(clientDb.tx.$files[product.image.id].delete())
        }
      } else {
        const productId = id()
        const chunk = clientDb.tx.products[productId].create({
          ...payload,
          createdAt: Date.now(),
        })
        if (categoryId) {
          chunk.link({ category: categoryId })
        }
        if (fileId) {
          chunk.link({ image: fileId })
        }
        await clientDb.transact(chunk)
      }

      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? t("admin.editProduct") : t("admin.addProduct")}
          </DialogTitle>
          <DialogDescription>{t("admin.productFormHint")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("admin.name")} htmlFor="admin-product-name">
                <Input
                  id="admin-product-name"
                  required
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </Field>
              <Field label={t("admin.slug")} htmlFor="admin-product-slug">
                <Input
                  id="admin-product-slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlug(slugify(event.target.value))
                    setSlugTouched(true)
                  }}
                />
              </Field>
            </div>

            <Field
              label={t("admin.descriptionLabel")}
              htmlFor="admin-product-description"
            >
              <textarea
                id="admin-product-description"
                required
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full min-w-0 resize-y border border-transparent border-b-input bg-transparent py-1 text-base outline-none focus-visible:border-b-ring md:text-sm"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("admin.price")} htmlFor="admin-product-price">
                <Input
                  id="admin-product-price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  placeholder="0.00"
                  onChange={(event) => setPrice(event.target.value)}
                />
              </Field>
              <Field
                label={t("admin.category")}
                htmlFor="admin-product-category"
              >
                <div className="relative">
                  <select
                    id="admin-product-category"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    className="h-10 w-full min-w-0 appearance-none border border-transparent border-b-input bg-transparent py-1 pr-6 text-base outline-none focus-visible:border-b-ring md:text-sm"
                  >
                    <option value="">{t("admin.none")}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(event) => setInStock(event.target.checked)}
                />
                {t("admin.inStock")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                {t("admin.featured")}
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t("admin.image")}
              </p>
              {currentImage?.url && !file && (
                <div className="size-24 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={currentImage.url}
                    alt={product?.name ?? ""}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="max-w-xs"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
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
                {t("admin.imageHint")}
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
                  : product
                    ? t("common.saveChanges")
                    : t("admin.addProduct")}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
