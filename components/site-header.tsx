"use client"

import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { CartSheet } from "@/components/cart-sheet"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t, locale } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="text-sm font-semibold tracking-widest uppercase"
        >
          {t("common.brand")}
        </Link>
        <nav className="flex items-center gap-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          <Link
            href={`/${locale}`}
            className="hidden transition-colors hover:text-foreground md:block"
          >
            {t("common.shop")}
          </Link>
          <Link
            href={`/${locale}/#categories`}
            className="transition-colors hover:text-foreground"
          >
            {t("common.categories")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <span className="hidden md:block">
            <CartSheet />
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("header.toggleTheme")}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
          </Button>
        </div>
      </div>
    </header>
  )
}
