"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import type { Banner } from "@/lib/types"

export function BannerCard({ banner }: { banner: Banner }) {
  const { locale } = useI18n()
  const href = banner.ctaHref ? `/${locale}${banner.ctaHref}` : `/${locale}`

  return (
    <div className="relative aspect-[5/2] w-full overflow-hidden rounded-lg bg-muted">
      {banner.image?.url ? (
        <Image
          src={banner.image.url}
          alt={banner.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div className="absolute inset-0 flex items-end justify-end p-4 sm:p-6">
        {banner.ctaLabel && (
          <Button
            render={<Link href={href} />}
            nativeButton={false}
            size="sm"
            variant="secondary"
          >
            {banner.ctaLabel}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
