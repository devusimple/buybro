"use client"

import { Feed } from "@/components/home/feed"
import { useI18n } from "@/lib/i18n"

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="flex flex-col items-start gap-6 py-14 sm:py-20">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          {t("home.kicker")}
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight uppercase sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t("home.description")}
        </p>
      </section>

      <Feed />

      <div className="pb-20 sm:pb-28" />
    </div>
  )
}
