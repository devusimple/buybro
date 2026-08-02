"use client"

import { useState, type FormEvent } from "react"
import { ChevronDown, MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { id, type User } from "@instantdb/react"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import {
  BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  type Address,
} from "@/lib/profile"

type AddressFormValues = {
  label: string
  fullName: string
  houseNo: string
  road: string
  area: string
  district: string
  division: string
  postalCode: string
  isDefault: boolean
}

function emptyForm(): AddressFormValues {
  return {
    label: "",
    fullName: "",
    houseNo: "",
    road: "",
    area: "",
    district: "",
    division: "",
    postalCode: "",
    isDefault: false,
  }
}

function toFormValues(address: Address): AddressFormValues {
  return {
    label: address.label ?? "",
    fullName: address.fullName ?? "",
    houseNo: address.houseNo ?? "",
    road: address.road ?? "",
    area: address.area ?? "",
    district: address.district ?? "",
    division: address.division ?? "",
    postalCode: address.postalCode ?? "",
    isDefault: address.isDefault ?? false,
  }
}

function AddressFields({
  values,
  onChange,
}: {
  values: AddressFormValues
  onChange: (values: AddressFormValues) => void
}) {
  const { t } = useI18n()
  const set = (key: keyof AddressFormValues, value: string | boolean) =>
    onChange({ ...values, [key]: value })

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("addresses.label")} htmlFor="addr-label">
          <Input
            id="addr-label"
            placeholder={t("addresses.labelPlaceholder")}
            value={values.label}
            onChange={(event) => set("label", event.target.value)}
          />
        </Field>
        <Field label={t("addresses.fullName")} htmlFor="addr-name">
          <Input
            id="addr-name"
            required
            placeholder={t("addresses.namePlaceholder")}
            value={values.fullName}
            onChange={(event) => set("fullName", event.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("addresses.houseNo")} htmlFor="addr-house">
          <Input
            id="addr-house"
            required
            placeholder={t("addresses.housePlaceholder")}
            value={values.houseNo}
            onChange={(event) => set("houseNo", event.target.value)}
          />
        </Field>
        <Field label={t("addresses.road")} htmlFor="addr-road">
          <Input
            id="addr-road"
            placeholder={t("addresses.roadPlaceholder")}
            value={values.road}
            onChange={(event) => set("road", event.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("addresses.area")} htmlFor="addr-area">
          <Input
            id="addr-area"
            required
            placeholder={t("addresses.areaPlaceholder")}
            value={values.area}
            onChange={(event) => set("area", event.target.value)}
          />
        </Field>
        <Field label={t("addresses.postalCode")} htmlFor="addr-zip">
          <Input
            id="addr-zip"
            required
            inputMode="numeric"
            placeholder={t("addresses.zipPlaceholder")}
            value={values.postalCode}
            onChange={(event) => set("postalCode", event.target.value)}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("addresses.district")} htmlFor="addr-district">
          <Input
            id="addr-district"
            required
            list="bd-districts"
            placeholder={t("addresses.districtPlaceholder")}
            value={values.district}
            onChange={(event) => set("district", event.target.value)}
          />
          <datalist id="bd-districts">
            {BANGLADESH_DISTRICTS.map((district) => (
              <option key={district} value={district} />
            ))}
          </datalist>
        </Field>
        <Field label={t("addresses.division")} htmlFor="addr-division">
          <div className="relative">
            <select
              id="addr-division"
              required
              className="h-10 w-full min-w-0 appearance-none border border-transparent border-b-input bg-transparent py-1 pr-6 text-base outline-none focus-visible:border-b-ring disabled:opacity-50 md:text-sm"
              value={values.division}
              onChange={(event) => set("division", event.target.value)}
            >
              <option value="" disabled>
                {t("addresses.selectDivision")}
              </option>
              {BANGLADESH_DIVISIONS.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => set("isDefault", event.target.checked)}
        />
        {t("addresses.setDefault")}
      </label>
    </div>
  )
}

export function AddressDialog({
  user,
  address,
  open,
  addresses,
  onOpenChange,
  onCreated,
}: {
  user: User
  address?: Address | null
  open: boolean
  addresses: Address[]
  onOpenChange: (open: boolean) => void
  onCreated?: (id: string) => void
}) {
  const { t } = useI18n()
  const [values, setValues] = useState<AddressFormValues>(
    address ? toFormValues(address) : emptyForm()
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setValues(address ? toFormValues(address) : emptyForm())
      setError(null)
    }
    onOpenChange(next)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const isDefault = values.isDefault || addresses.length === 0
      const payload = {
        ownerId: user.id,
        label: values.label.trim() || undefined,
        fullName: values.fullName.trim(),
        houseNo: values.houseNo.trim(),
        road: values.road.trim() || undefined,
        area: values.area.trim(),
        district: values.district.trim(),
        division: values.division.trim(),
        postalCode: values.postalCode.trim(),
        country: "Bangladesh",
        isDefault,
        createdAt: address?.createdAt ?? Date.now(),
      }

      const addressId = address?.id ?? id()
      const txs = [
        ...addresses
          .filter(
            (other) => isDefault && other.isDefault && other.id !== addressId
          )
          .map((other) =>
            clientDb.tx.addresses[other.id].update({ isDefault: false })
          ),
        address
          ? clientDb.tx.addresses[address.id].update(payload)
          : clientDb.tx.addresses[addressId].create(payload),
      ]
      await clientDb.transact(txs)
      onOpenChange(false)
      onCreated?.(addressId)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("addresses.saveError"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {address ? t("addresses.editTitle") : t("addresses.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {address
              ? t("addresses.editDescription")
              : t("addresses.addDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <AddressFields values={values} onChange={setValues} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? t("common.saving")
                  : address
                    ? t("common.saveChanges")
                    : t("common.addAddress")}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddressCard({
  address,
  isOnly,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address
  isOnly: boolean
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}) {
  const { t } = useI18n()
  const roadLine = address.road ? `, ${address.road}` : ""
  return (
    <div className="flex flex-col gap-4 border border-border/60 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {address.label && <Badge variant="secondary">{address.label}</Badge>}
          {address.isDefault && (
            <Badge variant="outline">{t("addresses.defaultBadge")}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("addresses.editAria")}
          onClick={onEdit}
        >
          <Pencil />
        </Button>
      </div>
      <address className="flex flex-col gap-0.5 text-sm text-muted-foreground not-italic">
        <span className="font-semibold text-foreground">
          {address.fullName}
        </span>
        <span>
          {address.houseNo}
          {roadLine}
        </span>
        <span>{address.area}</span>
        <span>
          {address.district}, {address.division}
        </span>
        <span>
          {address.postalCode} · {address.country ?? "Bangladesh"}
        </span>
      </address>
      <div className="flex items-center gap-2">
        {!address.isDefault && (
          <Button variant="outline" size="sm" onClick={onSetDefault}>
            {t("addresses.setDefaultButton")}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 data-icon="inline-start" />
          {t("addresses.delete")}
        </Button>
      </div>
      {isOnly && (
        <p className="text-xs text-muted-foreground">
          {t("addresses.lastOnly")}
        </p>
      )}
    </div>
  )
}

export function AddressBook({
  user,
  addresses,
}: {
  user: User
  addresses: Address[]
}) {
  const { t } = useI18n()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(address: Address) {
    setEditing(address)
    setDialogOpen(true)
  }

  async function handleDelete(address: Address) {
    await clientDb.transact(clientDb.tx.addresses[address.id].delete())
  }

  async function handleSetDefault(address: Address) {
    await clientDb.transact([
      clientDb.tx.addresses[address.id].update({ isDefault: true }),
      ...addresses
        .filter((other) => other.id !== address.id && other.isDefault)
        .map((other) =>
          clientDb.tx.addresses[other.id].update({ isDefault: false })
        ),
    ])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t("addresses.title")}</CardTitle>
            <CardDescription>{t("addresses.description")}</CardDescription>
          </div>
          <Button size="sm" onClick={openAdd}>
            <Plus data-icon="inline-start" />
            {t("common.addAddress")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MapPin />
              </EmptyMedia>
              <EmptyTitle>{t("addresses.emptyTitle")}</EmptyTitle>
              <EmptyDescription>
                {t("addresses.emptyDescription")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isOnly={addresses.length === 1}
                onEdit={() => openEdit(address)}
                onDelete={() => handleDelete(address)}
                onSetDefault={() => handleSetDefault(address)}
              />
            ))}
          </div>
        )}
      </CardContent>
      <Separator className="mx-8 w-auto" />
      <div className="p-8 pt-6 text-xs text-muted-foreground">
        {t("addresses.footerNote")}
      </div>
      <AddressDialog
        user={user}
        address={editing}
        open={dialogOpen}
        addresses={addresses}
        onOpenChange={setDialogOpen}
      />
    </Card>
  )
}
