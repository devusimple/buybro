"use client"

import type { User } from "@instantdb/react"

import { SignInForm } from "@/components/auth/sign-in-form"
import { AccountSection } from "@/components/profile/account-section"
import { AddressBook } from "@/components/profile/address-book"
import { AvatarSection } from "@/components/profile/avatar-section"
import { GeneralInfoForm } from "@/components/profile/general-info-form"
import { OrdersSection } from "@/components/profile/orders-section"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export default function ProfilePage() {
  const { user, isLoading, error } = clientDb.useAuth()
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-destructive">
          {t("profile.authFailed", { message: error.message })}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {user ? <ProfileDashboard user={user} /> : <SignInForm />}
    </div>
  )
}

function ProfileDashboard({ user }: { user: User }) {
  const { t } = useI18n()
  const { data, isLoading } = clientDb.useQuery({
    profiles: {
      $: { where: { ownerId: user.id } },
      avatar: {},
    },
    addresses: {
      $: { where: { ownerId: user.id }, order: { createdAt: "desc" } },
    },
  })

  const profile = data?.profiles?.[0]
  const addresses = data?.addresses ?? []

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("profile.title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("profile.description")}
        </p>
      </header>

      <OrdersSection user={user} />
      <AvatarSection user={user} profile={profile} loading={isLoading} />
      <GeneralInfoForm user={user} profile={profile} />
      <AddressBook user={user} addresses={addresses} />
      <AccountSection user={user} />
    </div>
  )
}
