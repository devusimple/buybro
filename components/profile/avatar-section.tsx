"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera } from "lucide-react"
import type { User } from "@instantdb/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { ensureProfile, type Profile } from "@/lib/profile"

export function AvatarSection({
  user,
  profile,
  loading,
}: {
  user: User
  profile?: Profile
  loading: boolean
}) {
  const { t } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const avatarUrl = profile?.avatar?.url

  async function handleFile(file: File | undefined) {
    if (!file || !user) {
      return
    }
    setUploading(true)
    setError(null)
    try {
      const path = `${user.id}/avatars/${Date.now()}-${file.name}`
      const { data: fileData } = await clientDb.storage.uploadFile(path, file, {
        contentType: file.type,
      })
      const profileId = await ensureProfile(user.id, profile)
      await clientDb.transact(
        clientDb.tx.profiles[profileId].link({ avatar: fileData.id })
      )
      if (profile?.avatar) {
        await clientDb.transact(clientDb.tx.$files[profile.avatar.id].delete())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("avatar.uploadError"))
    } finally {
      setUploading(false)
      if (fileRef.current) {
        fileRef.current.value = ""
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("avatar.title")}</CardTitle>
        <CardDescription>{t("avatar.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        {loading ? (
          <Skeleton className="size-20 shrink-0" />
        ) : (
          <div className="relative size-20 shrink-0 overflow-hidden bg-muted ring-1 ring-foreground/10">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={t("avatar.alt")}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-lg font-semibold tracking-wider uppercase">
                {(profile?.displayName ?? user.email ?? "U").charAt(0)}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Camera data-icon="inline-start" />
            {uploading ? t("avatar.uploading") : t("avatar.upload")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
