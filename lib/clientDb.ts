import { init } from "@instantdb/react"

import schema from "@/instant.schema"

export const clientDb = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
})
