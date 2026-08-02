import { NextResponse, type NextRequest } from "next/server"

import { defaultLocale, hasLocale, LOCALE_COOKIE } from "@/lib/i18n/config"

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get("accept-language") ?? ""
  const primary = acceptLanguage.split(",")[0]?.split("-")[0]?.trim()
  if (primary && hasLocale(primary)) {
    return primary
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const firstSegment = pathname.split("/")[1] ?? ""
  if (hasLocale(firstSegment)) {
    return NextResponse.next()
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  const response = NextResponse.redirect(url)
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
