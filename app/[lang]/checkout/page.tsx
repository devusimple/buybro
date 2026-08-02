"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@instantdb/react"
import {
  Banknote,
  Check,
  CreditCard,
  MapPin,
  PackageCheck,
  Plus,
  ShoppingBag,
  Smartphone,
} from "lucide-react"

import { SignInForm } from "@/components/auth/sign-in-form"
import { AddressDialog } from "@/components/profile/address-book"
import { Field } from "@/components/profile/field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  selectCount,
  selectSubtotal,
  useCartHydrated,
  useCartStore,
  type CartItem,
} from "@/lib/cart-store"
import { clientDb } from "@/lib/clientDb"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { placeOrder } from "@/lib/orders"
import type { Address } from "@/lib/profile"
import { cn } from "@/lib/utils"

type PlacedOrder = {
  orderId: string
  totalCents: number
  count: number
}

export default function CheckoutPage() {
  const hydrated = useCartHydrated()
  const items = useCartStore((state) => state.items)
  const { user, isLoading, error } = clientDb.useAuth()
  const { t, locale } = useI18n()
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  if (placed) {
    return <OrderSuccess order={placed} />
  }

  if (!hydrated || isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-destructive">
          {t("checkout.authFailed", { message: error.message })}
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>{t("checkout.cartEmpty")}</EmptyTitle>
            <EmptyDescription>
              <span>{t("checkout.cartEmptyDescription")} </span>
              <Link
                href={`/${locale}`}
                className="font-medium underline underline-offset-4"
              >
                {t("checkout.continueShopping")}
              </Link>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {user ? (
        <CheckoutFlow user={user} items={items} onOrderPlaced={setPlaced} />
      ) : (
        <SignInForm titleKey="auth.titleCheckout" />
      )}
    </div>
  )
}

function CheckoutFlow({
  user,
  items,
  onOrderPlaced,
}: {
  user: User
  items: CartItem[]
  onOrderPlaced: (order: PlacedOrder) => void
}) {
  const { t } = useI18n()
  const { data, isLoading } = clientDb.useQuery({
    profiles: {
      $: { where: { ownerId: user.id } },
    },
    addresses: {
      $: { where: { ownerId: user.id }, order: { createdAt: "desc" } },
    },
  })

  const profile = data?.profiles?.[0]
  const addresses = data?.addresses ?? []

  const clear = useCartStore((state) => state.clear)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [phone, setPhone] = useState(profile?.phone ?? "")
  const [addOpen, setAddOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = selectSubtotal(items)
  const total = subtotal
  const count = selectCount(items)

  const selected =
    addresses.find((address) => address.id === selectedId) ??
    addresses.find((address) => address.isDefault) ??
    addresses[0]

  async function handlePlaceOrder() {
    if (!selected) {
      return
    }
    setPlacing(true)
    setError(null)
    try {
      const orderId = await placeOrder({
        ownerId: user.id,
        items,
        totalCents: total,
      })
      clear()
      onOrderPlaced({ orderId, totalCents: total, count })
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkout.placeError"))
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("checkout.title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("checkout.description")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-8">
          <AddressCardSection
            user={user}
            addresses={addresses}
            isLoading={isLoading}
            selected={selected}
            onSelect={setSelectedId}
            addOpen={addOpen}
            onAddOpenChange={setAddOpen}
          />

          <Card>
            <CardHeader>
              <CardTitle>{t("checkout.contactTitle")}</CardTitle>
              <CardDescription>
                {t("checkout.contactDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("checkout.email")} htmlFor="checkout-email">
                  <Input
                    id="checkout-email"
                    type="email"
                    value={user.email ?? t("auth.guestNoEmail")}
                    disabled
                    readOnly
                  />
                </Field>
                <Field label={t("checkout.phone")} htmlFor="checkout-phone">
                  <Input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t("checkout.phonePlaceholder")}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <PaymentMethodSection />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              <CardDescription>
                {count === 1
                  ? t("common.item", { count })
                  : t("common.items", { count })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-xs font-semibold tracking-wider uppercase">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.priceCents)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  {t("checkout.subtotal")}
                </span>
                <span className="text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  {t("checkout.shipping")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("common.free")}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase">
                  {t("checkout.total")}
                </span>
                <span className="text-lg font-semibold">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {t("checkout.totalNote")}
              </p>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                size="lg"
                disabled={!selected || placing}
                onClick={handlePlaceOrder}
              >
                {placing
                  ? t("checkout.placingOrder")
                  : t("checkout.placeOrder")}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function AddressCardSection({
  user,
  addresses,
  isLoading,
  selected,
  onSelect,
  addOpen,
  onAddOpenChange,
}: {
  user: User
  addresses: Address[]
  isLoading: boolean
  selected?: Address
  onSelect: (id: string) => void
  addOpen: boolean
  onAddOpenChange: (open: boolean) => void
}) {
  const { t } = useI18n()
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("checkout.shippingAddress")}</CardTitle>
            <CardDescription>
              {t("checkout.shippingDescription")}
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddOpenChange(true)}
          >
            <Plus data-icon="inline-start" />
            {t("checkout.addNew")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : addresses.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MapPin />
              </EmptyMedia>
              <EmptyTitle>{t("checkout.noAddressTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("checkout.noAddressDescription")}
              </EmptyDescription>
            </EmptyHeader>
            <Button size="sm" onClick={() => onAddOpenChange(true)}>
              <Plus data-icon="inline-start" />
              {t("common.addAddress")}
            </Button>
          </Empty>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => {
              const isSelected = selected?.id === address.id
              return (
                <li key={address.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(address.id)}
                    data-selected={isSelected || undefined}
                    className={cn(
                      "flex h-full w-full flex-col gap-3 border bg-transparent p-4 text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
                      isSelected
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-border/60 hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {address.label && (
                          <Badge variant="secondary">{address.label}</Badge>
                        )}
                        {address.isDefault && (
                          <Badge variant="outline">{t("common.default")}</Badge>
                        )}
                      </div>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-transparent"
                        )}
                      >
                        <Check className="size-3.5" />
                      </span>
                    </div>
                    <address className="flex flex-col gap-0.5 text-sm text-muted-foreground not-italic">
                      <span className="font-semibold text-foreground">
                        {address.fullName}
                      </span>
                      <span>
                        {address.houseNo}
                        {address.road ? `, ${address.road}` : ""}
                      </span>
                      <span>{address.area}</span>
                      <span>
                        {address.district}, {address.division}
                      </span>
                      <span>
                        {address.postalCode} · {address.country ?? "Bangladesh"}
                      </span>
                    </address>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
      <AddressDialog
        user={user}
        open={addOpen}
        addresses={addresses}
        onOpenChange={onAddOpenChange}
        onCreated={onSelect}
      />
    </Card>
  )
}

function PaymentMethodSection() {
  const { t } = useI18n()
  const comingSoon = [
    { name: "bKash", icon: Smartphone },
    { name: "Nagad", icon: Smartphone },
    { name: t("checkout.creditCard"), icon: CreditCard },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("checkout.paymentTitle")}</CardTitle>
        <CardDescription>{t("checkout.paymentDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3 border border-dashed border-foreground/20 bg-muted/40 p-4">
          <Badge variant="outline" className="shrink-0">
            {t("common.comingSoon")}
          </Badge>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">
              {t("checkout.onlinePayment")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("checkout.onlinePaymentNote")}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-selected
          className="flex items-center gap-3 border border-primary bg-transparent p-4 text-left ring-1 ring-primary/30"
        >
          <Banknote className="size-5 shrink-0 text-primary" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-sm font-semibold">{t("checkout.cod")}</p>
            <p className="text-xs text-muted-foreground">
              {t("checkout.codNote")}
            </p>
          </div>
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        </button>

        {comingSoon.map((option) => (
          <button
            key={option.name}
            type="button"
            disabled
            className="flex cursor-not-allowed items-center gap-3 border border-border/60 bg-transparent p-4 text-left opacity-60"
          >
            <option.icon className="size-5 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-semibold">{option.name}</p>
              <p className="text-xs text-muted-foreground">
                {t("common.comingSoon")}
              </p>
            </div>
            <Badge variant="outline">{t("common.soon")}</Badge>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

function OrderSuccess({ order }: { order: PlacedOrder }) {
  const { t, locale } = useI18n()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6">
      <EmptyMedia variant="icon">
        <PackageCheck />
      </EmptyMedia>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("checkout.confirmed")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("checkout.confirmedNote", {
            id: order.orderId.slice(0, 8).toUpperCase(),
            total: formatPrice(order.totalCents),
          })}
        </p>
      </div>
      <div className="grid w-full max-w-sm grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 border border-border/60 p-4">
          <span className="text-base font-semibold">
            {order.count === 1
              ? t("common.item", { count: order.count })
              : t("common.items", { count: order.count })}
          </span>
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            {t("checkout.quantity")}
          </span>
        </div>
        <div className="flex flex-col gap-1 border border-border/60 p-4">
          <span className="text-base font-semibold">
            {formatPrice(order.totalCents)}
          </span>
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            {t("checkout.totalDue")}
          </span>
        </div>
        <div className="flex flex-col gap-1 border border-border/60 p-4">
          <span className="text-base font-semibold">{t("checkout.cash")}</span>
          <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            {t("checkout.payment")}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          render={<Link href={`/${locale}/profile`} />}
          nativeButton={false}
        >
          {t("checkout.trackOrder")}
        </Button>
        <Button
          variant="outline"
          render={<Link href={`/${locale}`} />}
          nativeButton={false}
        >
          {t("checkout.continueShopping")}
        </Button>
      </div>
    </div>
  )
}
