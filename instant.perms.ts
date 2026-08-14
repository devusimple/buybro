// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react"

const rules = {
  // Anything not explicitly ruled below is denied. This closes the implicit
  // default-true hole for deletion and unlisted namespaces.
  $default: {
    allow: {
      view: "false",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  // No ad-hoc attribute types: every write must use a schema-defined attr.
  attrs: {
    allow: {
      create: "false",
    },
  },
  // Streams are internal upload plumbing; gate writes on a real user so
  // anonymous clients can't tamper with them. Uploads still work for any
  // signed-in (or guest) user.
  $streams: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
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
      delete: "isOwner",
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
      // Orders are created by the server checkout endpoint (admin SDK),
      // never by end users directly.
      create: "isAdmin",
      // Buyers may only cancel; everything else (status, totals, shipping)
      // is a server/admin write.
      update: "isAdmin || (isOwner && onlyStatusCancel)",
      delete: "isAdmin",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
      isEmailMatch: "data.ownerEmail in auth.ref('$user.email')",
      onlyStatusCancel:
        "request.modifiedFields.all(field, field in ['status']) && newData.status == 'cancelled'",
    },
  },
  orderItems: {
    allow: {
      view: "isAdmin || isOwner || isEmailMatch",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
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
      // Stock decrements and rating recomputes happen on the server (admin
      // SDK). Non-admins never write products from the client.
      update: "isAdmin",
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
      update: "isAdmin",
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
      // Usage rows are written by the server checkout endpoint only.
      // View stays open so the checkout client can display "fully used".
      view: "true",
      create: "isAdmin",
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
      // Review creation runs through the server endpoint so `verified`,
      // `rating`, and the product aggregates can't be forged by clients.
      create: "isAdmin",
      // Signed-in users bump helpfulCount with a one-tap vote; nothing else
      // is editable by them.
      update: "isAdmin || (auth.id != null && onlyModifiesHelpfulCount)",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "'admin' in auth.ref('$user.roles.type')",
      onlyModifiesHelpfulCount:
        "request.modifiedFields.all(field, field in ['helpfulCount'])",
    },
  },
  productFaqs: {
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
  notifications: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isAdmin",
      update: "isOwner || isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isOwner: "auth.id == data.ownerId",
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
