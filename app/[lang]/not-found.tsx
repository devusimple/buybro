"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function NotFound() {
  const { t, locale } = useI18n()

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-3xl flex-col items-start justify-center gap-6 px-4 sm:px-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("notFound.title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("notFound.description")}
        </p>
      </div>
      <Button render={<Link href={`/${locale}`} />} nativeButton={false}>
        {t("notFound.backHome")}
      </Button>
    </div>
  )
}
