import { init } from "@instantdb/admin"

import schema from "@/instant.schema"

// Server-only instant client. Administers the app bypassing client perms.
// Never import this module from a client component or route handler that
// runs in the browser.
export const adminDb = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN,
  schema,
})
