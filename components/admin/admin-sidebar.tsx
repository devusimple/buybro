"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Tags,
  Users,
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t, locale } = useI18n()
  const pathname = usePathname()
  const { user } = clientDb.useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const { data } = clientDb.useQuery({
    $users: {},
    profiles: {},
  })

  const currentUser = data?.$users?.[0]
  const profile = (data?.profiles ?? []).find(
    (entry) => entry.ownerId === user?.id
  )

  const displayName =
    profile?.displayName ??
    currentUser?.nickname ??
    currentUser?.email?.split("@")[0] ??
    t("account.guest")
  const email = currentUser?.email ?? (user?.isGuest ? t("account.guest") : "")
  const avatar = currentUser?.imageURL ?? ""

  const navItems = [
    {
      title: t("admin.dashboard"),
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: t("admin.products"),
      href: `/${locale}/admin/products`,
      icon: Package,
    },
    {
      title: t("admin.categories"),
      href: `/${locale}/admin/categories`,
      icon: Tags,
    },
    {
      title: t("admin.orders"),
      href: `/${locale}/admin/orders`,
      icon: ShoppingCart,
    },
    {
      title: t("admin.users"),
      href: `/${locale}/admin/users`,
      icon: Users,
    },
  ]

  function isActive(item: (typeof navItems)[number]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  async function handleSignOut() {
    setSigningOut(true)
    await clientDb.auth.signOut()
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href={`/${locale}`} />}
            >
              <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                {t("common.brand").slice(0, 1)}
              </span>
              <span className="text-base font-semibold tracking-widest uppercase">
                {t("common.brand")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin.label")}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item)}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("common.shop")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href={`/${locale}`} />}>
                  <Store />
                  <span>{t("admin.viewStore")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg grayscale">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {displayName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-foreground/70">
                    {email}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={4}
                className="min-w-56"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={avatar} alt={displayName} />
                      <AvatarFallback className="rounded-lg">
                        {displayName.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/${locale}/profile`}
                      className={cn("flex items-center gap-2")}
                    />
                  }
                >
                  <CircleUserRound />
                  {t("common.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/${locale}`}
                      className={cn("flex items-center gap-2")}
                    />
                  }
                >
                  <Store />
                  {t("admin.viewStore")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={signingOut}
                  onClick={handleSignOut}
                >
                  <LogOut />
                  {signingOut ? t("account.signingOut") : t("account.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
