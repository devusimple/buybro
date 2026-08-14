"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

const OTP_LENGTH = 6

export function AdminAuth() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = clientDb.useAuth()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isSignedIn = !!user && !user.isGuest

  // The admin gate now runs on the server from the auth cookie. After a
  // successful sign-in re-render the server layout so it can re-check roles.
  useEffect(() => {
    if (!isSignedIn) {
      return
    }
    const attempt = (times: number) => {
      if (times === 0) {
        refreshTimer.current = null
        return
      }
      refreshTimer.current = setTimeout(() => {
        router.refresh()
        attempt(times - 1)
      }, 700)
    }
    attempt(3)
    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current)
      }
    }
  }, [isSignedIn, router])

  async function handleSendCode(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await clientDb.auth.sendMagicCode({ email })
      setStep("code")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.sendError"))
    } finally {
      setPending(false)
    }
  }

  async function handleVerify(value: string) {
    if (value.length !== OTP_LENGTH) {
      return
    }
    setPending(true)
    setError(null)
    try {
      await clientDb.auth.signInWithMagicCode({ email, code: value })
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.codeError"))
    } finally {
      setPending(false)
    }
  }

  async function handleSignOut() {
    setPending(true)
    setError(null)
    try {
      await clientDb.auth.signOut()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t("admin.signInTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {step === "email"
            ? t("admin.signInDescription")
            : t("auth.codePrompt", { email })}
        </p>
      </div>

      {isSignedIn && step === "email" && (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            {t("admin.notAdminDescription")}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleSignOut}
          >
            {t("account.signOut")}
          </Button>
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              {t("auth.email")}
            </label>
            <Input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {t("auth.sendCode")}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-otp"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              {t("auth.code")}
            </label>
            <InputOTP
              id="admin-otp"
              maxLength={OTP_LENGTH}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={(value) => {
                setCode(value)
                void handleVerify(value)
              }}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            disabled={pending || code.length !== OTP_LENGTH}
            onClick={() => void handleVerify(code)}
          >
            {t("auth.verify")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => {
              setStep("email")
              setCode("")
              setError(null)
            }}
          >
            {t("auth.changeEmail")}
          </Button>
        </div>
      )}
    </div>
  )
}
