// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react"

const rules = {
  $users: {
    allow: {
      view: "auth.id == data.id || isAdmin",
      // Users can't modify their own $users record (or self-link roles).
      // Roles are granted via the admin SDK.
      update: "false",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  roles: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  profiles: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isOwner",
      update: "isOwner",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  addresses: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
    },
  },
  orders: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isOwner",
      update: "isOwner || isAdmin",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  orderItems: {
    allow: {
      view: "isAdmin || isOwner",
      create: "isOwner",
    },
    bind: {
      isOwner: "auth.id in data.ref('order.ownerId')",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  products: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  categories: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  collections: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  banners: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  $files: {
    allow: {
      view: "true",
      create: "isOwner || isAdmin",
      delete: "isOwner || isAdmin",
    },
    bind: {
      isOwner: "data.path.startsWith(auth.id + '/')",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
} satisfies InstantRules

export default rules
