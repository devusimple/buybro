import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomTabs } from "@/components/bottom-tabs"
import { LocaleProvider } from "@/lib/i18n"
import { hasLocale, locales } from "@/lib/i18n/config"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Buybro — Gadget store",
    template: "%s | Buybro",
  },
  description:
    "Shop the latest gadgets: audio, wearables, laptops, phones and accessories.",
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <LocaleProvider locale={lang}>
            <div className="flex min-h-svh flex-col pb-16 md:pb-0">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <BottomTabs />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
