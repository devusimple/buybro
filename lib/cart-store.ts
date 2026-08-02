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
}

export type CartItem = CartProduct & {
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: CartProduct) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          }
        }),
      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            }
          }
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "buybro-cart",
      storage: createJSONStorage(() => localStorage),
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
