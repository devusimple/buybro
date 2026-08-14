import { getUnverifiedUserFromInstantCookie } from "@instantdb/react/nextjs"

import { AdminAuth } from "@/components/admin/admin-auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { adminDb } from "@/lib/adminDb"

async function requestHasAdminRole() {
  try {
    const claimed = await getUnverifiedUserFromInstantCookie(
      process.env.NEXT_PUBLIC_INSTANT_APP_ID!
    )
    if (!claimed?.refresh_token) {
      return false
    }
    const user = await adminDb.auth.verifyToken(claimed.refresh_token)
    if (!user?.id) {
      return false
    }
    const { $users } = await adminDb.query({
      $users: { $: { where: { id: user.id } }, roles: {} },
    })
    return ($users?.[0]?.roles ?? []).some(
      (role) => (role as { type?: unknown }).type === "admin"
    )
  } catch {
    return false
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await requestHasAdminRole()

  if (!isAdmin) {
    return <AdminAuth />
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
