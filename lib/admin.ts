import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"
import { clientDb } from "@/lib/clientDb"

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type AdminProduct = InstaQLEntity<
  AppSchema,
  "products",
  { category: {}; image: {}; collections: {} }
>
export type AdminCategory = InstaQLEntity<
  AppSchema,
  "categories",
  { products: {}; parent: {}; children: {} }
>
export type AdminCollection = InstaQLEntity<
  AppSchema,
  "collections",
  { products: {} }
>
export type AdminOrder = InstaQLEntity<
  AppSchema,
  "orders",
  { items: { product: {} } }
>
export type AdminProfile = InstaQLEntity<AppSchema, "profiles">
/* eslint-enable @typescript-eslint/no-empty-object-type */

export function useIsAdmin() {
  const { data, isLoading } = clientDb.useQuery({
    $users: {
      roles: {},
    },
  })
  const roles = data?.$users?.[0]?.roles ?? []
  return {
    isAdmin: roles.some((role) => role.type === "admin"),
    isLoading,
  }
}
