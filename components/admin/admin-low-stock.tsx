"use client"

import { useState } from "react"
import { PackageX, Plus, RefreshCcw } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export const LOW_STOCK_THRESHOLD = 5

type LowStockProduct = {
  id: string
  name: string
  slug: string
  stock?: number | null
  inStock?: boolean | null
}

const RESTOCK_AMOUNTS = [5, 10, 25] as const

export function AdminLowStock({ products }: { products: LowStockProduct[] }) {
  const { t } = useI18n()
  const [error, setError] = useState<string | null>(null)

  const lowStock = products
    .filter((product) => {
      const stock = product.stock
      return (
        product.inStock === false ||
        product.stock === 0 ||
        (stock != null && stock <= LOW_STOCK_THRESHOLD)
      )
    })
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))

  async function handleRestock(product: LowStockProduct, amount: number) {
    setError(null)
    try {
      await clientDb.transact(
        clientDb.tx.products[product.id].update({
          stock: (product.stock ?? 0) + amount,
          inStock: true,
        })
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1.5">
          <CardTitle>{t("admin.lowStockTitle")}</CardTitle>
          <CardDescription>
            {t("admin.lowStockDescription", {
              count: LOW_STOCK_THRESHOLD,
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {lowStock.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageX />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noLowStock")}</EmptyTitle>
              <EmptyDescription>{t("admin.noLowStockHint")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {lowStock.slice(0, 8).map((product) => {
              const out = product.stock === 0 || product.inStock === false
              return (
                <li
                  key={product.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={out ? "destructive" : "secondary"}
                        className="shrink-0"
                      >
                        {out
                          ? t("product.outOfStock")
                          : t("product.lowStock", {
                              count: product.stock ?? 0,
                            })}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        /{product.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {RESTOCK_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestock(product, amount)}
                      >
                        <Plus data-icon="inline-start" />
                        {amount}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => handleRestock(product, 0)}
                    >
                      <RefreshCcw data-icon="inline-start" />
                      {t("admin.markInStock")}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
