"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  selectCount,
  selectSubtotal,
  useCartHydrated,
  useCartStore,
} from "@/lib/cart-store"
import { formatPrice } from "@/lib/format"
import { useI18n } from "@/lib/i18n"
import { useUiStore } from "@/lib/ui-store"

export function CartSheet() {
  const open = useUiStore((state) => state.cartOpen)
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const hydrated = useCartHydrated()
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const { t, locale } = useI18n()

  const count = selectCount(items)
  const subtotal = selectSubtotal(items)

  return (
    <Sheet open={open} onOpenChange={setCartOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={t("cart.openCart")}
          />
        }
      >
        <ShoppingBag />
        {hydrated && count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {count}
          </span>
        )}
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("cart.title")}</SheetTitle>
          <SheetDescription>
            {hydrated && count > 0
              ? count === 1
                ? t("common.item", { count })
                : t("common.items", { count })
              : t("cart.emptyTitle")}
          </SheetDescription>
        </SheetHeader>

        {!hydrated || items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBag />
              </EmptyMedia>
              <EmptyTitle>{t("cart.emptyTitle")}</EmptyTitle>
              <EmptyDescription>{t("cart.emptyDescription")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-6 p-8 pt-2">
            {items.map((item) => (
              <li key={item.lineId} className="flex gap-4">
                <div className="size-20 shrink-0 overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        href={`/${locale}/products/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="truncate text-xs font-semibold tracking-wider uppercase hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="truncate text-[0.6875rem] text-muted-foreground">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.priceCents)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("cart.remove", { name: item.name })}
                      onClick={() => removeItem(item.lineId)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label={t("cart.decreaseQuantity")}
                        onClick={() =>
                          setQuantity(item.lineId, item.quantity - 1)
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label={t("cart.increaseQuantity")}
                        onClick={() =>
                          setQuantity(item.lineId, item.quantity + 1)
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {hydrated && items.length > 0 && (
          <SheetFooter>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-semibold tracking-widest uppercase">
                {t("cart.subtotal")}
              </span>
              <span className="text-base font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("cart.shippingNote")}
            </p>
            <Button
              size="lg"
              render={<Link href={`/${locale}/checkout`} />}
              nativeButton={false}
              onClick={() => setCartOpen(false)}
            >
              {t("cart.checkout")}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
