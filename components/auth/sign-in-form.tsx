"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { clientDb } from "@/lib/clientDb"
import { useI18n, type TranslationKey } from "@/lib/i18n"

export function SignInForm({
  titleKey = "auth.title",
  showGuest = true,
}: {
  titleKey?: TranslationKey
  showGuest?: boolean
}) {
  const { t } = useI18n()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function handleVerify(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await clientDb.auth.signInWithMagicCode({ email, code })
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.codeError"))
    } finally {
      setPending(false)
    }
  }

  async function handleGuest() {
    setPending(true)
    setError(null)
    try {
      await clientDb.auth.signInAsGuest()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signInError"))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">
          {t(titleKey)}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {step === "email"
            ? t("auth.emailPrompt")
            : t("auth.codePrompt", { email })}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              {t("auth.email")}
            </label>
            <Input
              id="email"
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
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="code"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              {t("auth.code")}
            </label>
            <Input
              id="code"
              type="text"
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {t("auth.verify")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep("email")
              setError(null)
            }}
          >
            {t("auth.changeEmail")}
          </Button>
        </form>
      )}

      {showGuest && (
        <div className="flex flex-col gap-4">
          <Separator />
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleGuest}
          >
            {t("auth.guest")}
          </Button>
        </div>
      )}
    </div>
  )
}
