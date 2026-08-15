"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { id } from "@instantdb/react"
import { Dices } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AdminCoupon } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { isDiscountType, normalizeCode } from "@/lib/coupons"
import { useI18n } from "@/lib/i18n"

const COUPON_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generateCode() {
  let code = ""
  for (let index = 0; index < 8; index++) {
    code += COUPON_CHARS[Math.floor(Math.random() * COUPON_CHARS.length)]
  }
  return code
}

function toDateTimeLocal(ms?: number) {
  if (!ms) {
    return ""
  }
  const date = new Date(ms)
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).getTime() : undefined
}

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export function CouponForm({ coupon }: { coupon?: AdminCoupon | null }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [code, setCode] = useState(coupon?.code ?? "")
  const [discountType, setDiscountType] = useState(coupon?.discountType ?? "")
  const [value, setValue] = useState(
    coupon?.value != null ? String(coupon.value) : ""
  )
  const [minSubtotal, setMinSubtotal] = useState(
    coupon?.minSubtotalCents != null ? String(coupon.minSubtotalCents) : ""
  )
  const [maxDiscount, setMaxDiscount] = useState(
    coupon?.maxDiscountCents != null ? String(coupon.maxDiscountCents) : ""
  )
  const [usageLimit, setUsageLimit] = useState(
    coupon?.usageLimit != null ? String(coupon.usageLimit) : ""
  )
  const [active, setActive] = useState(coupon?.active !== false)
  const [startsAt, setStartsAt] = useState(toDateTimeLocal(coupon?.startsAt))
  const [expiresAt, setExpiresAt] = useState(toDateTimeLocal(coupon?.expiresAt))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isDiscountType(discountType) || !toNumber(value)) {
      setError(t("couponForm.invalid"))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        code: normalizeCode(code),
        discountType,
        value: toNumber(value)!,
        minSubtotalCents: toNumber(minSubtotal),
        maxDiscountCents: toNumber(maxDiscount),
        usageLimit: toNumber(usageLimit),
        active,
        startsAt: fromDateTimeLocal(startsAt),
        expiresAt: fromDateTimeLocal(expiresAt),
        createdAt: coupon?.createdAt ?? Date.now(),
      }
      await clientDb.transact(
        coupon
          ? clientDb.tx.coupons[coupon.id].update(payload)
          : clientDb.tx.coupons[id()].create(payload)
      )
      goBack()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  function goBack() {
    router.push(`/${locale}/admin/coupons`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>
            {coupon ? t("admin.editCoupon") : t("admin.addCoupon")}
          </CardTitle>
          <CardDescription>{t("admin.couponFormHint")}</CardDescription>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft data-icon="inline-start" />
          {t("common.back")}
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-lg flex-col gap-5">
            <Field label={t("admin.code")} htmlFor="admin-coupon-code">
              <div className="flex gap-2">
                <Input
                  id="admin-coupon-code"
                  required
                  className="uppercase"
                  placeholder="WELCOME10"
                  value={code}
                  onChange={(event) =>
                    setCode(normalizeCode(event.target.value))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCode(generateCode())}
                >
                  <Dices data-icon="inline-start" />
                  {t("couponForm.generate")}
                </Button>
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t("admin.discountType")}
                htmlFor="admin-coupon-type"
              >
                <Select
                  value={discountType}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setDiscountType(value)
                    }
                  }}
                >
                  <SelectTrigger
                    id="admin-coupon-type"
                    aria-label={t("admin.discountType")}
                    className="w-full"
                    size="sm"
                  >
                    <SelectValue placeholder={t("admin.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percent">
                        {t("admin.percent")}
                      </SelectItem>
                      <SelectItem value="flat">{t("admin.flat")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label={
                  discountType === "percent"
                    ? t("admin.valuePercent")
                    : t("admin.valueFlat")
                }
                htmlFor="admin-coupon-value"
              >
                <Input
                  id="admin-coupon-value"
                  type="number"
                  required
                  min="1"
                  inputMode="numeric"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t("admin.minSubtotal")} htmlFor="admin-coupon-min">
                <Input
                  id="admin-coupon-min"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="0"
                  value={minSubtotal}
                  onChange={(event) => setMinSubtotal(event.target.value)}
                />
              </Field>
              <Field label={t("admin.maxDiscount")} htmlFor="admin-coupon-max">
                <Input
                  id="admin-coupon-max"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="0"
                  value={maxDiscount}
                  onChange={(event) => setMaxDiscount(event.target.value)}
                />
              </Field>
              <Field label={t("admin.usageLimit")} htmlFor="admin-coupon-usage">
                <Input
                  id="admin-coupon-usage"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="0"
                  value={usageLimit}
                  onChange={(event) => setUsageLimit(event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("admin.startsAt")} htmlFor="admin-coupon-starts">
                <Input
                  id="admin-coupon-starts"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => setStartsAt(event.target.value)}
                />
              </Field>
              <Field
                label={t("admin.expiresAt")}
                htmlFor="admin-coupon-expires"
              >
                <Input
                  id="admin-coupon-expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
              />
              {t("admin.active")}
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={goBack}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? t("common.saving")
                  : coupon
                    ? t("common.saveChanges")
                    : t("admin.addCoupon")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
