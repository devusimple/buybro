"use client"

import * as React from "react"

import { AdminBestSellers } from "@/components/admin/admin-best-sellers"
import { AdminCategoryRevenue } from "@/components/admin/admin-category-revenue"
import { AdminCouponPerformance } from "@/components/admin/admin-coupon-performance"
import { AdminLowStock } from "@/components/admin/admin-low-stock"
import { AdminOrderHealth } from "@/components/admin/admin-order-health"
import { AdminOrderStatus } from "@/components/admin/admin-order-status"
import { AdminPaymentSplit } from "@/components/admin/admin-payment-split"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminStatCards } from "@/components/admin/admin-stat-cards"
import { AdminTopProducts } from "@/components/admin/admin-top-products"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"

export default function AdminDashboardPage() {
  const { t } = useI18n()
  const [now] = React.useState(() => Date.now())
  const { data, isLoading } = clientDb.useQuery({
    products: {},
    categories: {},
    orders: {
      items: { product: { category: {} } },
    },
    profiles: {},
    coupons: {},
    couponUsages: {},
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
  const coupons = data?.coupons ?? []
  const couponUsages = data?.couponUsages ?? []

  const activeOrders = orders.filter((order) => order.status !== "cancelled")
  const revenue = activeOrders.reduce((sum, order) => sum + order.totalCents, 0)
  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length
  const aov =
    activeOrders.length > 0 ? Math.round(revenue / activeOrders.length) : 0
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const newCustomers = profiles.filter(
    (profile) => (profile.createdAt ?? 0) >= thirtyDaysAgo
  ).length

  const stats = [
    {
      label: t("admin.totalRevenue"),
      value: formatPrice(revenue),
      hint: t("admin.revenueHint"),
    },
    {
      label: t("admin.averageOrderValue"),
      value: formatPrice(aov),
      hint: t("admin.aovHint"),
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
    {
      label: t("admin.customers"),
      value: String(profiles.length),
      hint: t("admin.customersHint", { count: newCustomers }),
    },
  ]

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AdminStatCards items={stats} />
      <AdminRevenueChart orders={orders} />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <AdminOrderStatus orders={orders} />
        <AdminCategoryRevenue orders={orders} />
        <AdminCouponPerformance
          coupons={coupons}
          couponUsages={couponUsages}
          orders={orders}
        />
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <AdminBestSellers orders={orders} />
        <AdminPaymentSplit orders={orders} />
        <AdminOrderHealth orders={orders} />
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <AdminTopProducts orders={orders} />
        <AdminLowStock products={products} />
      </div>
      <AdminRecentOrders orders={orders} profiles={profiles} />
    </div>
  )
}
