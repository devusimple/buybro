"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import type { Category } from "@/lib/types"

export function CategoryStrip({ categories }: { categories: Category[] }) {
  const { t, locale } = useI18n()
  const topLevel = categories.filter((category) => !category.parent)

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-widest uppercase">
        {t("home.browseByCategory")}
      </h2>
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {topLevel.map((category) => (
          <Button
            key={category.id}
            render={<Link href={`/${locale}/categories/${category.slug}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            {category.name}
          </Button>
        ))}
        <Button
          render={<Link href={`/${locale}/categories`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          {t("home.allCategories")}
        </Button>
      </div>
    </section>
  )
}
