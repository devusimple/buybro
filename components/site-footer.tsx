"use client"

import { useI18n } from "@/lib/i18n"

const currentYear = new Date().getFullYear()

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-xs tracking-widest text-muted-foreground uppercase sm:px-6">
        <p>{t("footer.copyright", { year: currentYear })}</p>
        <p>{t("footer.tagline")}</p>
      </div>
    </footer>
  )
}
