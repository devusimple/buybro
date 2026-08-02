"use client"

import { usePathname, useRouter } from "next/navigation"

import {
  LOCALE_COOKIE,
  localeShortLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LocaleSwitcher() {
  const { locale } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(next: Locale) {
    if (next === locale) {
      return
    }
    setLocaleCookie(next)
    const segments = pathname.split("/")
    segments[1] = next
    const target = segments.join("/") || `/${next}`
    router.replace(target)
  }

  return (
    <div className="flex items-center gap-0.5 border border-border/60 p-0.5">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          aria-label={item === "en" ? "English" : "বাংলা"}
          onClick={() => switchTo(item)}
          className={cn(
            "px-2 py-1 text-xs font-semibold tracking-widest uppercase transition-colors",
            item === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {localeShortLabels[item]}
        </button>
      ))}
    </div>
  )
}
