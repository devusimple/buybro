import type { InstaQLEntity } from "@instantdb/react"

import type { AppSchema } from "@/instant.schema"

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Product = InstaQLEntity<
  AppSchema,
  "products",
  {
    image: {}
    gallery: {}
    variants: {}
    category: { parent: { parent: {} } }
    collections: {}
  }
>

export type Category = InstaQLEntity<
  AppSchema,
  "categories",
  { parent: {}; children: {} }
>

export type Collection = InstaQLEntity<AppSchema, "collections">

export type Banner = InstaQLEntity<AppSchema, "banners", { image: {} }>

export type Review = InstaQLEntity<AppSchema, "reviews">

export type Variant = InstaQLEntity<AppSchema, "productVariants">
/* eslint-enable @typescript-eslint/no-empty-object-type */
