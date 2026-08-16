import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// next/image refuses to serve SVGs through the optimizer (dangerouslyAllowSVG
// is intentionally off). Render them directly with unoptimized instead.
// InstantDB serves signed CDN URLs without extensions, so check the storage
// path as well.
export function isSvgFile(path?: string | null, url?: string | null) {
  return Boolean(
    (path && path.toLowerCase().endsWith(".svg")) ||
    (url && /\.svg(\?.*)?$/i.test(url))
  )
}

const LOCALE_PREFIXES = ["/en/", "/bn/"]

// Normalize a banner CTA target for storage: strip a leading locale prefix so
// the value stays locale-agnostic (the storefront prepends the active locale).
// Absolute http(s) URLs are kept as-is.
export function normalizeCtaHref(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  const prefix = LOCALE_PREFIXES.find((candidate) =>
    value.startsWith(candidate)
  )
  const path = prefix ? value.slice(prefix.length - 1) : value
  return path.startsWith("/") ? path : `/${path}`
}

// Resolve a stored CTA target against the active locale, tolerating legacy
// locale-prefixed values and absolute URLs.
export function resolveBannerHref(ctaHref: string | undefined, locale: string) {
  if (!ctaHref) {
    return `/${locale}`
  }
  const value = ctaHref.trim()
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  const prefix = LOCALE_PREFIXES.find((candidate) =>
    value.startsWith(candidate)
  )
  const path = prefix
    ? value.slice(prefix.length - 1)
    : value.startsWith("/")
      ? value
      : `/${value}`
  return `/${locale}${path}`
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i

// InstantDB serves signed CDN URLs without extensions, so check the storage
// path as well.
export function isImageFile(path?: string | null, url?: string | null) {
  return Boolean(
    (path && IMAGE_EXTENSIONS.test(path)) || (url && IMAGE_EXTENSIONS.test(url))
  )
}
