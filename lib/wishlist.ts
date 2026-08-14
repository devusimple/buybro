"use client"

import { id } from "@instantdb/react"
import { useCallback, useMemo } from "react"

import { clientDb } from "@/lib/clientDb"

export function useWishlist() {
  const { user } = clientDb.useAuth()
  const { data } = clientDb.useQuery({
    wishlists: {
      $: { where: { ownerId: user?.id ?? "" }, limit: 1 },
      products: {},
    },
  })

  const wishlist = data?.wishlists?.[0]
  const products = useMemo(() => wishlist?.products ?? [], [wishlist])

  const productIds = useMemo(
    () => new Set(products.map((product) => product.id)),
    [products]
  )

  const isWishlisted = useCallback(
    (productId: string) => productIds.has(productId),
    [productIds]
  )

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) {
        return false
      }
      if (productIds.has(productId)) {
        if ((products?.length ?? 0) <= 1) {
          if (wishlist) {
            await clientDb.transact(clientDb.tx.wishlists[wishlist.id].delete())
          }
        } else if (wishlist) {
          await clientDb.transact(
            clientDb.tx.wishlists[wishlist.id].unlink({ products: [productId] })
          )
        }
        return false
      }
      if (wishlist) {
        await clientDb.transact(
          clientDb.tx.wishlists[wishlist.id].link({ products: [productId] })
        )
      } else {
        await clientDb.transact(
          clientDb.tx.wishlists[id()]
            .create({ ownerId: user.id, createdAt: Date.now() })
            .link({ products: [productId] })
        )
      }
      return true
    },
    [user, productIds, products, wishlist]
  )

  return { isWishlisted, productIds, products, toggle }
}
