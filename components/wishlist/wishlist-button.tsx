"use client"

import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { clientDb } from "@/lib/clientDb"
import { useI18n } from "@/lib/i18n"
import { useWishlist } from "@/lib/wishlist"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  className,
}: {
  productId: string
  className?: string
}) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { user } = clientDb.useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const [busy, setBusy] = useState(false)

  const active = isWishlisted(productId)

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      router.push(`/${locale}/profile`)
      return
    }
    if (busy) {
      return
    }
    setBusy(true)
    try {
      await toggle(productId)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-active={active || undefined}
      disabled={busy}
      aria-label={active ? t("wishlist.remove") : t("wishlist.add")}
      onClick={handleClick}
      className={cn(
        "rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur hover:bg-background hover:text-destructive",
        "data-[active]:bg-destructive/10 data-[active]:text-destructive",
        className
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </Button>
  )
}
