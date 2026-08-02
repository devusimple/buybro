"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import type { User } from "@instantdb/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

export function AccountSection({ user }: { user: User }) {
  const { t } = useI18n()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    await clientDb.auth.signOut()
    setPending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("account.title")}</CardTitle>
        <CardDescription>{t("account.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-widest uppercase">
              {t("account.signedInAs")}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.email ?? t("account.guest")}
              {user.isGuest && ` · ${t("account.guestSuffix")}`}
            </p>
          </div>
          <Separator />
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            disabled={pending}
            onClick={handleSignOut}
          >
            <LogOut data-icon="inline-start" />
            {pending ? t("account.signingOut") : t("account.signOut")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
