const KEY = "buybro:recently-viewed"
const MAX = 12

export function getRecentProductIds(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : []
  } catch {
    return []
  }
}

export function addRecentProduct(id: string) {
  if (typeof window === "undefined") {
    return
  }
  try {
    const current = getRecentProductIds().filter((item) => item !== id)
    current.unshift(id)
    window.localStorage.setItem(KEY, JSON.stringify(current.slice(0, MAX)))
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}
