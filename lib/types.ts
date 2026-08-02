import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Product = InstaQLEntity<
  AppSchema,
  "products",
  { image: {}; category: {} }
>
/* eslint-enable @typescript-eslint/no-empty-object-type */

export type Category = InstaQLEntity<AppSchema, "categories">
