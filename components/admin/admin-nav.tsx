"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquareText,
  Package,
  ShoppingCart,
  Tags,
  TicketPercent,
} from "lucide-react"

import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AdminNav() {
  const { t, locale } = useI18n()
  const pathname = usePathname()

  const items = [
    {
      href: `/${locale}/admin`,
      label: t("admin.dashboard"),
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: `/${locale}/admin/products`,
      label: t("admin.products"),
      icon: Package,
    },
    {
      href: `/${locale}/admin/categories`,
      label: t("admin.categories"),
      icon: Tags,
    },
    {
      href: `/${locale}/admin/orders`,
      label: t("admin.orders"),
      icon: ShoppingCart,
    },
    {
      href: `/${locale}/admin/coupons`,
      label: t("admin.coupons"),
      icon: TicketPercent,
    },
    {
      href: `/${locale}/admin/reviews`,
      label: t("admin.reviews"),
      icon: MessageSquareText,
    },
  ]

  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border/60 pb-4">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
