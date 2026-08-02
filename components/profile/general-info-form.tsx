"use client"

import { useState, type FormEvent } from "react"
import type { User } from "@instantdb/react"

import { Field } from "@/components/profile/field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { ensureProfile, type Profile } from "@/lib/profile"

export function GeneralInfoForm({
  user,
  profile,
}: {
  user: User
  profile?: Profile
}) {
  const { t } = useI18n()
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "")
  const [phone, setPhone] = useState(profile?.phone ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const profileId = await ensureProfile(user.id, profile)
      await clientDb.transact(
        clientDb.tx.profiles[profileId].update({
          displayName: displayName.trim() || undefined,
          phone: phone.trim() || undefined,
        })
      )
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("generalInfo.saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("generalInfo.title")}</CardTitle>
        <CardDescription>{t("generalInfo.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label={t("generalInfo.displayName")} htmlFor="displayName">
            <Input
              id="displayName"
              value={displayName}
              autoComplete="name"
              placeholder={t("generalInfo.displayNamePlaceholder")}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </Field>
          <Field label={t("generalInfo.email")} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={user.email ?? t("generalInfo.guestEmail")}
              disabled
              readOnly
            />
          </Field>
          <Field label={t("generalInfo.phone")} htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              placeholder={t("generalInfo.phonePlaceholder")}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && (
            <p className="text-sm text-muted-foreground">
              {t("generalInfo.saved")}
            </p>
          )}
          <Button type="submit" className="w-fit" disabled={saving}>
            {saving ? t("common.saving") : t("common.saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
