"use client"

import { useRef, useState } from "react"
import { Download, Upload } from "lucide-react"
import { id } from "@instantdb/react"

import { Button } from "@/components/ui/button"
import type { AdminCategory, AdminProduct } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { downloadTextFile, parseCsv, toCsv } from "@/lib/csv"
import { useI18n } from "@/lib/i18n"

const HEADERS = [
  "name",
  "slug",
  "description",
  "sku",
  "price",
  "compareAtPrice",
  "stock",
  "inStock",
  "featured",
  "status",
  "category",
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function AdminProductCsv({
  products,
  categories,
}: {
  products: AdminProduct[]
  categories: AdminCategory[]
}) {
  const { t } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleExport() {
    const rows: (string | number | undefined)[][] = [
      HEADERS,
      ...products.map((product) => [
        product.name,
        product.slug,
        product.description ?? "",
        product.sku ?? "",
        (product.priceCents / 100).toFixed(2),
        product.compareAtPriceCents != null
          ? (product.compareAtPriceCents / 100).toFixed(2)
          : "",
        product.stock != null ? String(product.stock) : "",
        product.inStock ? "true" : "false",
        product.featured ? "true" : "false",
        product.status === "draft" ? "draft" : "active",
        product.category?.name ?? "",
      ]),
    ]
    downloadTextFile(
      `buybro-products-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(rows)
    )
    setMessage(t("admin.csvExportDone"))
    setError(null)
  }

  async function handleImport(file: File) {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const text = await file.text()
      const rows = parseCsv(text)
      const headerRow = rows[0]?.map((header) => header.trim().toLowerCase())
      if (rows.length < 2 || !headerRow) {
        setError(t("admin.csvInvalid"))
        return
      }
      const column = (name: string) => headerRow.indexOf(name)
      const categoryByName = new Map(
        categories.map((category) => [category.name.toLowerCase(), category])
      )
      const productBySlug = new Map(
        products.map((product) => [product.slug, product])
      )

      const txs: unknown[] = []
      let createdCount = 0
      let updatedCount = 0

      for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]
        const get = (name: string) => {
          const index = column(name)
          return index >= 0 ? (row[index] ?? "").trim() : ""
        }
        const name = get("name")
        if (!name) {
          continue
        }
        const slug = get("slug") || slugify(name)
        const price = parseFloat(get("price"))
        const compareAt = parseFloat(get("compareAtPrice"))
        const stockRaw = get("stock")
        const stock = stockRaw === "" ? undefined : parseInt(stockRaw, 10)
        const categoryName = get("category")
        const category = categoryName
          ? categoryByName.get(categoryName.toLowerCase())
          : undefined

        const payload = {
          name,
          slug,
          description: get("description") || " ",
          sku: get("sku") || undefined,
          priceCents:
            Number.isFinite(price) && price > 0 ? Math.round(price * 100) : 0,
          compareAtPriceCents:
            Number.isFinite(compareAt) && compareAt > 0
              ? Math.round(compareAt * 100)
              : undefined,
          stock:
            Number.isFinite(stock) && stock != null && stock >= 0
              ? stock
              : undefined,
          inStock: get("inStock") === "false" ? false : true,
          featured: get("featured") === "true",
          status: get("status") === "draft" ? "draft" : "active",
        }

        const existing = productBySlug.get(slug)
        if (existing) {
          let chunk = clientDb.tx.products[existing.id].update(payload)
          if (category) {
            chunk = chunk.link({ category: category.id })
          }
          txs.push(chunk)
          updatedCount += 1
        } else {
          const productId = id()
          let chunk = clientDb.tx.products[productId].create({
            ...payload,
            createdAt: Date.now(),
          })
          if (category) {
            chunk = chunk.link({ category: category.id })
          }
          txs.push(chunk)
          createdCount += 1
        }
      }

      if (txs.length > 0) {
        await clientDb.transact(txs as Parameters<typeof clientDb.transact>[0])
      }
      setMessage(
        t("admin.csvImportDone", {
          created: createdCount,
          updated: updatedCount,
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.csvImportError"))
    } finally {
      setBusy(false)
      if (fileRef.current) {
        fileRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={handleExport}
      >
        <Download data-icon="inline-start" />
        {t("admin.exportCsv")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        <Upload data-icon="inline-start" />
        {t("admin.importCsv")}
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="text/csv,.csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            handleImport(file)
          }
        }}
      />
      {message && <p className="text-xs text-emerald-600">{message}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
