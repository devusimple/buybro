"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n, type TranslationKey } from "@/lib/i18n"

type Section = {
  title: TranslationKey
  body: TranslationKey
}

const SECTIONS: Record<"warranty" | "returns", Section[]> = {
  warranty: [
    {
      title: "policies.warranty.coverageTitle",
      body: "policies.warranty.coverageBody",
    },
    {
      title: "policies.warranty.coveredTitle",
      body: "policies.warranty.coveredBody",
    },
    {
      title: "policies.warranty.notCoveredTitle",
      body: "policies.warranty.notCoveredBody",
    },
    {
      title: "policies.warranty.claimTitle",
      body: "policies.warranty.claimBody",
    },
  ],
  returns: [
    {
      title: "policies.returns.windowTitle",
      body: "policies.returns.windowBody",
    },
    {
      title: "policies.returns.conditionTitle",
      body: "policies.returns.conditionBody",
    },
    {
      title: "policies.returns.processTitle",
      body: "policies.returns.processBody",
    },
    {
      title: "policies.returns.refundTitle",
      body: "policies.returns.refundBody",
    },
  ],
}

export function PolicyPage({ kind }: { kind: "warranty" | "returns" }) {
  const { t, locale } = useI18n()
  const root = `policies.${kind}.` as const

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Button
        render={<Link href={`/${locale}`} />}
        nativeButton={false}
        variant="ghost"
        size="sm"
        className="mb-8 px-0"
      >
        <ArrowLeft data-icon="inline-start" />
        {t("product.backToShop")}
      </Button>

      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight uppercase sm:text-3xl">
          {t(`${root}title`)}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(`${root}description`)}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(`${root}intro`)}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-6">
        {SECTIONS[kind].map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base">{t(section.title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(section.body)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 border-t border-border/60 pt-6">
        <h2 className="text-lg font-semibold tracking-tight uppercase">
          {t("policies.supportTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("policies.supportDescription")}
          <Link
            href={`/${locale}/profile`}
            className="font-medium text-primary underline underline-offset-4"
          >
            {" "}
            {t("policies.contactUs")}
          </Link>
        </p>
      </div>
    </div>
  )
}
