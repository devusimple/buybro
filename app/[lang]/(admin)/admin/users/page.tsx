"use client"

import { useState } from "react"
import { Search, Users as UsersIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

type UserRow = {
  id: string
  name: string
  email: string
  avatar: string
  isAdmin: boolean
  joinedAt: number | null
  orderCount: number
  totalSpent: number
}

export default function AdminUsersPage() {
  const { t, locale } = useI18n()
  const [search, setSearch] = useState("")

  const { data, isLoading } = clientDb.useQuery({
    $users: { roles: {} },
    profiles: { avatar: {} },
    orders: {},
  })

  const profileByOwner = new Map(
    (data?.profiles ?? []).map((profile) => [profile.ownerId, profile])
  )

  const rows: UserRow[] = (data?.$users ?? []).map((user) => {
    const profile = profileByOwner.get(user.id)
    const userOrders = (data?.orders ?? []).filter(
      (order) => order.ownerId === user.id
    )
    const totalSpent = userOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalCents, 0)
    return {
      id: user.id,
      name:
        profile?.displayName ??
        user.nickname ??
        user.email?.split("@")[0] ??
        t("account.guest"),
      email: user.email ?? t("account.guest"),
      avatar: user.imageURL ?? profile?.avatar?.url ?? "",
      isAdmin: (user.roles ?? []).some((role) => role.type === "admin"),
      joinedAt: profile?.createdAt ?? null,
      orderCount: userOrders.length,
      totalSpent,
    }
  })

  rows.sort((a, b) => {
    if (a.isAdmin !== b.isAdmin) {
      return a.isAdmin ? -1 : 1
    }
    return (b.joinedAt ?? 0) - (a.joinedAt ?? 0)
  })

  const query = search.trim().toLowerCase()
  const filtered = query
    ? rows.filter(
        (row) =>
          row.name.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query)
      )
    : rows

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("admin.usersTitle")}</CardTitle>
            <CardDescription>{t("admin.usersDescription")}</CardDescription>
          </div>
          {rows.length > 0 && (
            <div className="relative max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("admin.searchUsers")}
                className="pl-8"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon />
              </EmptyMedia>
              <EmptyTitle>{t("admin.noUsers")}</EmptyTitle>
              <EmptyDescription>{t("admin.noUsersHint")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("admin.noSearchResults")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.customer")}</TableHead>
                <TableHead>{t("admin.role")}</TableHead>
                <TableHead>{t("admin.joined")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.orders")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.totalSpent")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={row.avatar} alt={row.name} />
                        <AvatarFallback>
                          {row.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{row.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {row.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.isAdmin ? "default" : "outline"}>
                      {row.isAdmin
                        ? t("admin.adminRole")
                        : t("admin.memberRole")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.joinedAt
                      ? new Date(row.joinedAt).toLocaleDateString(
                          locale === "bn" ? "bn-BD" : "en-BD",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.orderCount}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatPrice(row.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
