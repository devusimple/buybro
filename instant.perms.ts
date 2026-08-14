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
      view: "isOwner || isAdmin || isEmailMatch",
      create: "isOwner",
      update: "isOwner || isAdmin || isEmailMatch",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
      isEmailMatch: "data.ownerEmail in auth.ref('$user.email')",
    },
  },
  orderItems: {
    allow: {
      view: "isAdmin || isOwner || isEmailMatch",
      create: "isOwner",
    },
    bind: {
      isOwner: "auth.id in data.ref('order.ownerId')",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
      isEmailMatch:
        "data.ref('order.ownerEmail')[0] in auth.ref('$user.email')",
    },
  },
  products: {
    allow: {
      view: "true",
      create: "isAdmin",
      // Stock decrements on checkout are made by the (guest or signed-in)
      // customer placing the order. TODO(security): move to a server-side
      // app once InstantDB server models land, so only a stock field changes.
      update: "auth.id != null || isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  productVariants: {
    allow: {
      view: "true",
      create: "isAdmin",
      update: "auth.id != null || isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  wishlists: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  coupons: {
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
  couponUsages: {
    allow: {
      view: "true",
      create: "true",
      update: "false",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
    },
  },
  reviews: {
    allow: {
      view: "true",
      create: "true",
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
