"use client"

import Link from "next/link"
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { selectCount, useCartHydrated, useCartStore } from "@/lib/cart-store"
import { useI18n } from "@/lib/i18n"
import { useUiStore } from "@/lib/ui-store"

function TabItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground"
      data-active={active || undefined}
    >
      <Icon className="size-5" />
      <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
        {label}
      </span>
    </Link>
  )
}

export function BottomTabs() {
  const pathname = usePathname()
  const hydrated = useCartHydrated()
  const count = selectCount(useCartStore((state) => state.items))
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const { t, locale } = useI18n()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-4 pb-[env(safe-area-inset-bottom)]">
        <TabItem
          href={`/${locale}`}
          icon={Home}
          label={t("common.home")}
          active={pathname === `/${locale}`}
        />
        <TabItem
          href={`/${locale}/#categories`}
          icon={LayoutGrid}
          label={t("common.shop")}
          active={pathname.startsWith(`/${locale}/products`)}
        />
        <TabItem
          href={`/${locale}/profile`}
          icon={User}
          label={t("common.profile")}
          active={pathname === `/${locale}/profile`}
        />
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingBag className="size-5" />
          <span className="text-[0.625rem] font-semibold tracking-widest uppercase">
            {t("common.cart")}
          </span>
          {hydrated && count > 0 && (
            <span className="absolute top-1 right-1/2 flex size-4 translate-x-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
