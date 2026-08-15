"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, X } from "lucide-react"
import { id, type User } from "@instantdb/react"

import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { Field } from "@/components/profile/field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AdminCategory, AdminCollection, AdminProduct } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { sanitizeHtml } from "@/lib/sanitize"

const NONE_CATEGORY = "__none__"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

type VariantRow = {
  key: string
  id?: string
  title: string
  value: string
  priceCents: string
  stock: string
}

type FaqRow = {
  key: string
  question: string
  answer: string
}

type GalleryUpload = {
  file: File
  url: string
}

export function ProductForm({
  categories,
  collections,
  product,
  user,
}: {
  categories: AdminCategory[]
  collections: AdminCollection[]
  product?: AdminProduct | null
  user: User
}) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [description, setDescription] = useState(product?.description ?? "")
  const [richDescription, setRichDescription] = useState(
    product?.richDescription ?? ""
  )
  const [sku, setSku] = useState(product?.sku ?? "")
  const [stock, setStock] = useState(
    product?.stock != null ? String(product.stock) : ""
  )
  const [price, setPrice] = useState(
    product ? String(product.priceCents / 100) : ""
  )
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPriceCents != null
      ? String(product.compareAtPriceCents / 100)
      : ""
  )
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? "")
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    (product?.collections ?? []).map((collection) => collection.id)
  )
  const [file, setFile] = useState<File | null>(null)
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const [galleryUploads, setGalleryUploads] = useState<GalleryUpload[]>([])
  const [galleryRemoved, setGalleryRemoved] = useState<string[]>([])
  const [variants, setVariants] = useState<VariantRow[]>(() =>
    (product?.variants ?? []).map((variant) => ({
      key: variant.id,
      id: variant.id,
      title: variant.title,
      value: variant.value,
      priceCents:
        variant.priceCents != null ? String(variant.priceCents / 100) : "",
      stock: variant.stock != null ? String(variant.stock) : "",
    }))
  )
  const nextVariantKey = useRef(0)
  const [faqs, setFaqs] = useState<FaqRow[]>(() =>
    (product?.faqs ?? []).map((faq) => ({
      key: faq.id,
      question: faq.question,
      answer: faq.answer,
    }))
  )
  const nextFaqKey = useRef(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const currentImage = product?.image
  const existingGallery = (product?.gallery ?? []).filter(
    (image) => !galleryRemoved.includes(image.id)
  )

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  function updateVariant(key: string, patch: Partial<VariantRow>) {
    setVariants((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    )
  }

  function addVariant() {
    setVariants((current) => [
      ...current,
      {
        key: `new-${nextVariantKey.current++}`,
        title: "",
        value: "",
        priceCents: "",
        stock: "",
      },
    ])
  }

  function removeVariant(key: string) {
    setVariants((current) => current.filter((row) => row.key !== key))
  }

  function updateFaq(key: string, patch: Partial<FaqRow>) {
    setFaqs((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    )
  }

  function addFaq() {
    setFaqs((current) => [
      ...current,
      { key: `new-${nextFaqKey.current++}`, question: "", answer: "" },
    ])
  }

  function removeFaq(key: string) {
    setFaqs((current) => current.filter((row) => row.key !== key))
  }

  function handleGalleryFiles(selected: FileList | null) {
    const uploads = Array.from(selected ?? []).map((file) => {
      const url = URL.createObjectURL(file)
      objectUrls.current.push(url)
      return { file, url }
    })
    if (uploads.length > 0) {
      setGalleryUploads((current) => [...current, ...uploads])
    }
    if (galleryRef.current) {
      galleryRef.current.value = ""
    }
  }

  function removeGalleryUpload(index: number) {
    setGalleryUploads((current) => {
      const upload = current[index]
      if (upload) {
        URL.revokeObjectURL(upload.url)
      }
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  function goBack() {
    router.push(`/${locale}/admin/products`)
  }

  const objectUrls = useRef<string[]>([])
  useEffect(() => {
    const urls = objectUrls.current
    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url)
      }
    }
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const priceCents = Math.round(parseFloat(price || "0") * 100)
      const compareAt = parseFloat(compareAtPrice)
      const parsedStock = parseInt(stock, 10)
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        richDescription: sanitizeHtml(richDescription),
        sku: sku.trim() || undefined,
        priceCents,
        compareAtPriceCents:
          Number.isFinite(compareAt) && compareAt > 0
            ? Math.round(compareAt * 100)
            : undefined,
        stock:
          Number.isFinite(parsedStock) && parsedStock >= 0
            ? parsedStock
            : undefined,
        inStock,
        featured,
      }

      let thumbnailId: string | undefined
      if (file) {
        const path = `${user.id}/admin/products/thumb-${Date.now()}-${file.name}`
        const { data: fileData } = await clientDb.storage.uploadFile(
          path,
          file,
          { contentType: file.type }
        )
        thumbnailId = fileData.id
      }

      const galleryIds: string[] = []
      for (const upload of galleryUploads) {
        const path = `${user.id}/admin/products/gallery-${Date.now()}-${upload.file.name}`
        const { data: fileData } = await clientDb.storage.uploadFile(
          path,
          upload.file,
          { contentType: upload.file.type }
        )
        galleryIds.push(fileData.id)
      }

      const txs: unknown[] = []

      if (product) {
        const chunk = clientDb.tx.products[product.id].update(payload)
        if (categoryId) {
          chunk.link({ category: categoryId })
        } else if (product.category) {
          chunk.unlink({ category: product.category.id })
        }
        if (thumbnailId) {
          chunk.link({ image: thumbnailId })
        }
        if (galleryIds.length > 0) {
          chunk.link({ gallery: galleryIds })
        }
        if (galleryRemoved.length > 0) {
          chunk.unlink({ gallery: galleryRemoved })
        }
        const currentCollectionIds = (product.collections ?? []).map(
          (collection) => collection.id
        )
        const collectionsToAdd = selectedCollections.filter(
          (collectionId) => !currentCollectionIds.includes(collectionId)
        )
        const collectionsToRemove = currentCollectionIds.filter(
          (collectionId) => !selectedCollections.includes(collectionId)
        )
        if (collectionsToAdd.length > 0) {
          chunk.link({ collections: collectionsToAdd })
        }
        if (collectionsToRemove.length > 0) {
          chunk.unlink({ collections: collectionsToRemove })
        }
        txs.push(chunk)
        if (thumbnailId && product.image) {
          txs.push(clientDb.tx.$files[product.image.id].delete())
        }
        for (const removedId of galleryRemoved) {
          txs.push(clientDb.tx.$files[removedId].delete())
        }
        for (const variant of product.variants ?? []) {
          txs.push(clientDb.tx.productVariants[variant.id].delete())
        }
        for (const row of variants) {
          const variantId = id()
          txs.push(
            clientDb.tx.productVariants[variantId]
              .create(buildVariantPayload(row))
              .link({ product: product.id })
          )
        }
        for (const faq of product.faqs ?? []) {
          txs.push(clientDb.tx.productFaqs[faq.id].delete())
        }
        for (const [index, row] of faqs.entries()) {
          if (!row.question.trim() || !row.answer.trim()) {
            continue
          }
          const faqId = id()
          txs.push(
            clientDb.tx.productFaqs[faqId]
              .create({
                question: row.question.trim(),
                answer: row.answer.trim(),
                sortOrder: index,
              })
              .link({ product: product.id })
          )
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
        if (thumbnailId) {
          chunk.link({ image: thumbnailId })
        }
        if (galleryIds.length > 0) {
          chunk.link({ gallery: galleryIds })
        }
        if (selectedCollections.length > 0) {
          chunk.link({ collections: selectedCollections })
        }
        txs.push(chunk)
        for (const row of variants) {
          const variantId = id()
          txs.push(
            clientDb.tx.productVariants[variantId]
              .create(buildVariantPayload(row))
              .link({ product: productId })
          )
        }
        for (const [index, row] of faqs.entries()) {
          if (!row.question.trim() || !row.answer.trim()) {
            continue
          }
          const faqId = id()
          txs.push(
            clientDb.tx.productFaqs[faqId]
              .create({
                question: row.question.trim(),
                answer: row.answer.trim(),
                sortOrder: index,
              })
              .link({ product: productId })
          )
        }
      }

      await clientDb.transact(txs as Parameters<typeof clientDb.transact>[0])
      goBack()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>
            {product ? t("admin.editProduct") : t("admin.addProduct")}
          </CardTitle>
          <CardDescription>{t("admin.productFormHint")}</CardDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft data-icon="inline-start" />
          {t("common.back")}
        </Button>
      </CardHeader>
      <CardContent>
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

            <Field
              label={t("admin.richDescription")}
              htmlFor="admin-product-rich-description"
            >
              <RichTextEditor
                id="admin-product-rich-description"
                value={richDescription}
                onChange={setRichDescription}
                placeholder={t("admin.richDescriptionHint")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
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
                label={t("admin.discountPrice")}
                htmlFor="admin-product-compare-at-price"
              >
                <Input
                  id="admin-product-compare-at-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  placeholder="0.00"
                  onChange={(event) => setCompareAtPrice(event.target.value)}
                />
              </Field>
              <Field label={t("admin.sku")} htmlFor="admin-product-sku">
                <Input
                  id="admin-product-sku"
                  value={sku}
                  placeholder="BB-1001"
                  onChange={(event) => setSku(event.target.value)}
                />
              </Field>
              <Field label={t("admin.stock")} htmlFor="admin-product-stock">
                <Input
                  id="admin-product-stock"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="0"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t("admin.category")}
                htmlFor="admin-product-category"
              >
                <Select
                  value={categoryId || NONE_CATEGORY}
                  onValueChange={(value) =>
                    setCategoryId(value && value !== NONE_CATEGORY ? value : "")
                  }
                >
                  <SelectTrigger
                    id="admin-product-category"
                    aria-label={t("admin.category")}
                    className="w-full"
                    size="sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={NONE_CATEGORY}>
                        {t("admin.none")}
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex flex-wrap content-end gap-6 pb-1">
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
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t("admin.collections")}
              </p>
              {collections.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("admin.noCollections")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {collections.map((collection) => {
                    const checked = selectedCollections.includes(collection.id)
                    return (
                      <label
                        key={collection.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedCollections((current) =>
                              checked
                                ? current.filter((id) => id !== collection.id)
                                : [...current, collection.id]
                            )
                          }
                        />
                        {collection.name}
                      </label>
                    )
                  })}
                </div>
              )}
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
              {file && thumbUrl && (
                <div className="size-24 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={thumbUrl}
                    alt=""
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
                  onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null
                    if (selected) {
                      if (thumbUrl) {
                        URL.revokeObjectURL(thumbUrl)
                      }
                      const url = URL.createObjectURL(selected)
                      objectUrls.current.push(url)
                      setThumbUrl(url)
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
                {t("admin.imageHint")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {t("admin.gallery")}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {existingGallery.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      aria-label={t("admin.removeImage")}
                      onClick={() =>
                        setGalleryRemoved((current) => [...current, image.id])
                      }
                      className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                {galleryUploads.map((upload, index) => (
                  <div
                    key={upload.url}
                    className="group relative aspect-square overflow-hidden bg-muted"
                  >
                    <Image
                      src={upload.url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      aria-label={t("admin.removeImage")}
                      onClick={() => removeGalleryUpload(index)}
                      className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="max-w-xs"
                  onChange={(event) => handleGalleryFiles(event.target.files)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("admin.galleryHint")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {t("admin.variants")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus data-icon="inline-start" />
                  {t("admin.addVariant")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("admin.variantsHint")}
              </p>
              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("admin.noVariants")}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {variants.map((row) => (
                    <div
                      key={row.key}
                      className="grid gap-2 rounded-md border border-border p-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                    >
                      <Input
                        value={row.title}
                        placeholder={t("admin.variantTitle")}
                        onChange={(event) =>
                          updateVariant(row.key, {
                            title: event.target.value,
                          })
                        }
                      />
                      <Input
                        value={row.value}
                        placeholder={t("admin.variantValue")}
                        onChange={(event) =>
                          updateVariant(row.key, { value: event.target.value })
                        }
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.priceCents}
                        placeholder={t("admin.variantPrice")}
                        onChange={(event) =>
                          updateVariant(row.key, {
                            priceCents: event.target.value,
                          })
                        }
                      />
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={row.stock}
                        placeholder={t("admin.variantStock")}
                        onChange={(event) =>
                          updateVariant(row.key, { stock: event.target.value })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={t("admin.removeVariant")}
                        onClick={() => removeVariant(row.key)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {t("admin.faqs")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFaq}
                >
                  <Plus data-icon="inline-start" />
                  {t("admin.addFaq")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("admin.faqsHint")}
              </p>
              {faqs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("admin.noFaqs")}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {faqs.map((row) => (
                    <div
                      key={row.key}
                      className="grid gap-2 rounded-md border border-border p-2"
                    >
                      <Input
                        value={row.question}
                        placeholder={t("admin.faqQuestionPlaceholder")}
                        onChange={(event) =>
                          updateFaq(row.key, { question: event.target.value })
                        }
                      />
                      <div className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={row.answer}
                          placeholder={t("admin.faqAnswerPlaceholder")}
                          onChange={(event) =>
                            updateFaq(row.key, { answer: event.target.value })
                          }
                          className="w-full min-w-0 flex-1 resize-y border border-transparent border-b-input bg-transparent py-1 text-base outline-none focus-visible:border-b-ring md:text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label={t("admin.removeFaq")}
                          onClick={() => removeFaq(row.key)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => goBack()}
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
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function buildVariantPayload(row: VariantRow) {
  const price = parseFloat(row.priceCents)
  const stock = parseInt(row.stock, 10)
  return {
    title: row.title.trim(),
    value: row.value.trim(),
    priceCents:
      Number.isFinite(price) && price > 0 ? Math.round(price * 100) : undefined,
    stock: Number.isFinite(stock) && stock > 0 ? stock : undefined,
  }
}
