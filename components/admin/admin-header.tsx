"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useI18n } from "@/lib/i18n"

export function AdminHeader() {
  const { t, locale } = useI18n()
  const pathname = usePathname()

  const title =
    pathname === `/${locale}/admin`
      ? t("admin.dashboard")
      : pathname.startsWith(`/${locale}/admin/users`)
        ? t("admin.usersTitle")
        : pathname.startsWith(`/${locale}/admin/products`)
          ? t("admin.productsTitle")
          : pathname.startsWith(`/${locale}/admin/categories`)
            ? t("admin.categoriesTitle")
            : pathname.startsWith(`/${locale}/admin/orders`)
              ? t("admin.ordersTitle")
              : t("admin.title")

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) items-center gap-2 border-b bg-background/80 backdrop-blur">
      <div className="flex items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-1 h-4 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-sm font-semibold tracking-widest uppercase">
          {title}
        </h1>
      </div>
    </header>
  )
}
