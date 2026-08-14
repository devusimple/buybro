"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import type { Banner } from "@/lib/types"
import { cn } from "@/lib/utils"

export function BannerCard({ banner }: { banner: Banner }) {
  const { locale } = useI18n()
  const href = banner.ctaHref ? `/${locale}${banner.ctaHref}` : `/${locale}`
  const hasImage = Boolean(banner.image?.url)
  const hasText = Boolean(banner.title || banner.subtitle)

  return (
    <div
      className={cn(
        "relative aspect-[5/2] w-full overflow-hidden rounded-lg",
        hasImage ? "bg-muted" : "bg-muted/60"
      )}
    >
      {hasImage && (
        <Image
          src={banner.image!.url}
          alt={banner.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {hasImage && hasText && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      )}

      <div className="absolute inset-0 flex items-end p-4 sm:p-6">
        <div className="flex w-full items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {banner.title && (
              <p
                className={cn(
                  "text-lg font-bold tracking-wide uppercase sm:text-2xl",
                  hasImage ? "text-white" : "text-foreground"
                )}
              >
                {banner.title}
              </p>
            )}
            {banner.subtitle && (
              <p
                className={cn(
                  "truncate text-sm",
                  hasImage ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {banner.subtitle}
              </p>
            )}
          </div>

          {banner.ctaLabel && (
            <Button
              render={<Link href={href} />}
              nativeButton={false}
              size="sm"
              variant={hasImage ? "secondary" : "default"}
              className="shrink-0"
            >
              {banner.ctaLabel}
              <ArrowRight data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
