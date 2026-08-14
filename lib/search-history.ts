const STORAGE_KEY = "buybro-recent-searches"
const MAX_TERMS = 8

export function getRecentSearchTerms(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((term): term is string => typeof term === "string")
      : []
  } catch {
    return []
  }
}

export function addRecentSearchTerm(term: string) {
  const trimmed = term.trim()
  if (!trimmed || typeof window === "undefined") {
    return
  }
  const next = [
    trimmed,
    ...getRecentSearchTerms().filter(
      (existing) => existing.toLowerCase() !== trimmed.toLowerCase()
    ),
  ].slice(0, MAX_TERMS)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function clearRecentSearchTerms() {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.removeItem(STORAGE_KEY)
}
