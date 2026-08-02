"use client"

import { useSyncExternalStore } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type CartProduct = {
  id: string
  slug: string
  name: string
  priceCents: number
  compareAtPriceCents?: number
  imageUrl?: string
  variant?: string
}

export type CartItem = CartProduct & {
  lineId: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: CartProduct) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const lineId = product.variant
            ? `${product.id}::${product.variant}`
            : product.id
          const existing = state.items.find((item) => item.lineId === lineId)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.lineId === lineId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, { ...product, lineId, quantity: 1 }],
          }
        }),
      setQuantity: (lineId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.lineId !== lineId),
            }
          }
          return {
            items: state.items.map((item) =>
              item.lineId === lineId ? { ...item, quantity } : item
            ),
          }
        }),
      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "buybro-cart",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const stored = persisted as Partial<CartState> | undefined
        return {
          ...current,
          items: (stored?.items ?? []).map((item) => ({
            ...item,
            lineId: item.lineId ?? item.id,
          })),
        }
      },
    }
  )
)

export function selectCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function selectSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}

export function useCartHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false
  )
}
