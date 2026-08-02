"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"

import type { Locale } from "@/lib/i18n/config"
import en, { type Messages } from "@/lib/i18n/dictionaries/en"
import bn from "@/lib/i18n/dictionaries/bn"

const dictionaries: Record<Locale, Messages> = { en, bn }

type Flatten<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends object
      ? Flatten<T[K], `${P}${K}.`>
      : `${P}${K}`
}[keyof T & string]

export type TranslationKey = Flatten<Messages>

export type TranslationParams = Record<string, string | number>

type I18nContextValue = {
  locale: Locale
  t: (key: TranslationKey, params?: TranslationParams) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolve(messages: Messages, key: string): string {
  const parts = key.split(".")
  let value: unknown = messages
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return key
    }
  }
  return typeof value === "string" ? value : key
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const messages = dictionaries[locale]

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const template = resolve(messages, key)
      if (!params) {
        return template
      }
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match
      )
    },
    [messages]
  )

  const value = useMemo(() => ({ locale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within a LocaleProvider")
  }
  return context
}
