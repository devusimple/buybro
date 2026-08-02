export const locales = ["en", "bn"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const LOCALE_COOKIE = "buybro-locale"

export const localeLabels: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
}

export const localeShortLabels: Record<Locale, string> = {
  en: "EN",
  bn: "বাং",
}

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
