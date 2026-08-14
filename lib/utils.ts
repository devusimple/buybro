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
