"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { id } from "@instantdb/react"

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
import type { AdminCategory } from "@/lib/admin"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"

const NONE_PARENT = "__none__"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function CategoryForm({
  categories,
  category,
}: {
  categories: AdminCategory[]
  category?: AdminCategory | null
}) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(Boolean(category))
  const [description, setDescription] = useState(category?.description ?? "")
  const [parentId, setParentId] = useState(category?.parent?.id ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim() || undefined,
      }
      const parentOptions = categories.filter(
        (option) => option.id !== category?.id
      )
      const parentOption = parentOptions.find(
        (option) => option.id === parentId
      )
      if (category) {
        const chunk = clientDb.tx.categories[category.id].update(payload)
        if (parentOption) {
          chunk.link({ parent: parentOption.id })
        } else if (category.parent) {
          chunk.unlink({ parent: category.parent.id })
        }
        await clientDb.transact(chunk)
      } else {
        const chunk = clientDb.tx.categories[id()].create(payload)
        if (parentOption) {
          chunk.link({ parent: parentOption.id })
        }
        await clientDb.transact(chunk)
      }
      goBack()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.saveError"))
    } finally {
      setSaving(false)
    }
  }

  function goBack() {
    router.push(`/${locale}/admin/categories`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>
            {category ? t("admin.editCategory") : t("admin.addCategory")}
          </CardTitle>
          <CardDescription>{t("admin.categoryFormHint")}</CardDescription>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft data-icon="inline-start" />
          {t("common.back")}
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-lg flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("admin.name")} htmlFor="admin-category-name">
                <Input
                  id="admin-category-name"
                  required
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </Field>
              <Field label={t("admin.slug")} htmlFor="admin-category-slug">
                <Input
                  id="admin-category-slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlug(slugify(event.target.value))
                    setSlugTouched(true)
                  }}
                />
              </Field>
            </div>
            <Field
              label={t("admin.descriptionLabel")}
              htmlFor="admin-category-description"
            >
              <textarea
                id="admin-category-description"
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full min-w-0 resize-y border border-transparent border-b-input bg-transparent py-1 text-base outline-none focus-visible:border-b-ring md:text-sm"
              />
            </Field>
            <Field
              label={t("admin.parentCategory")}
              htmlFor="admin-category-parent"
            >
              <Select
                value={parentId || NONE_PARENT}
                onValueChange={(value) =>
                  setParentId(value && value !== NONE_PARENT ? value : "")
                }
              >
                <SelectTrigger
                  id="admin-category-parent"
                  aria-label={t("admin.parentCategory")}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={NONE_PARENT}>
                      {t("admin.none")}
                    </SelectItem>
                    {categories
                      .filter((option) => option.id !== category?.id)
                      .map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.parent?.name
                            ? `${option.parent.name} / ${option.name}`
                            : option.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
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
                  : category
                    ? t("common.saveChanges")
                    : t("admin.addCategory")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
