"use client"

import Link from "next/link"
import { ShieldCheck, Store } from "lucide-react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useIsAdmin } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, error } = clientDb.useAuth()
  const isAdmin = useIsAdmin()
  const { t, locale } = useI18n()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <div className="flex flex-col items-start gap-6">
          <ShieldCheck className="size-10 text-muted-foreground" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight uppercase">
              {t("admin.accessDenied")}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("admin.accessDeniedDescription")}
            </p>
          </div>
          <Button
            render={<Link href={`/${locale}`} />}
            nativeButton={false}
            variant="outline"
          >
            <Store data-icon="inline-start" />
            {t("admin.viewStore")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
