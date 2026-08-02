"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const { t, locale } = useI18n()
  const { data, isLoading, error } = clientDb.useQuery({
    categories: {
      parent: {},
      children: {},
    },
  })

  const categories = (data?.categories ?? []) as Category[]
  const topLevel = categories.filter((category) => !category.parent)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase sm:text-3xl">
          {t("categories.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("categories.description")}
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-sm text-destructive">
          {t("categories.loadError", { message: error.message })}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topLevel.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.slug}`}
              className="group/card block"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {category.name}
                    <ArrowRight
                      data-icon="inline-end"
                      className="text-muted-foreground transition-transform group-hover/card:translate-x-0.5"
                    />
                  </CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {(category.children ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {(category.children ?? []).slice(0, 6).map((child) => (
                        <Badge key={child.id} variant="outline">
                          {child.name}
                        </Badge>
                      ))}
                      {(category.children ?? []).length > 6 && (
                        <Badge variant="secondary">
                          +{(category.children ?? []).length - 6}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
