"use client"

import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminStatCards } from "@/components/admin/admin-stat-cards"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

export default function AdminDashboardPage() {
  const { t } = useI18n()
  const { data, isLoading } = clientDb.useQuery({
    products: {},
    categories: {},
    orders: {
      items: { product: {} },
    },
    profiles: {},
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  const products = data?.products ?? []
  const categories = data?.categories ?? []
  const orders = data?.orders ?? []
  const profiles = data?.profiles ?? []

  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.totalCents, 0)
  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length

  const stats = [
    {
      label: t("admin.totalRevenue"),
      value: formatPrice(revenue),
      hint: t("admin.revenueHint"),
    },
    {
      label: t("admin.totalOrders"),
      value: String(orders.length),
      hint: t("admin.ordersHint"),
    },
    {
      label: t("admin.pendingOrders"),
      value: String(pendingCount),
      hint: t("admin.pendingHint"),
    },
    {
      label: t("admin.totalProducts"),
      value: String(products.length),
      hint: t("admin.productsHint", { count: categories.length }),
    },
  ]

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AdminStatCards items={stats} />
      <AdminRevenueChart orders={orders} />
      <AdminRecentOrders orders={orders} profiles={profiles} />
    </div>
  )
}
