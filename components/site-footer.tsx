"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useI18n } from "@/lib/i18n"

const currentYear = new Date().getFullYear()

export function SiteFooter() {
  const { t, locale } = useI18n()
  const pathname = usePathname()

  if (pathname.split("/").filter(Boolean)[1] === "admin") {
    return null
  }

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-4 text-xs tracking-widest text-muted-foreground uppercase sm:flex-row sm:justify-between sm:px-6">
        <p>{t("footer.copyright", { year: currentYear })}</p>
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}/policies/warranty`}
            className="transition-colors hover:text-foreground"
          >
            {t("policies.warranty.title")}
          </Link>
          <Link
            href={`/${locale}/policies/returns`}
            className="transition-colors hover:text-foreground"
          >
            {t("policies.returns.title")}
          </Link>
        </nav>
        <p>{t("footer.tagline")}</p>
      </div>
    </footer>
  )
}
