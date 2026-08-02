// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react"

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
      nickname: i.string().optional(),
    }),
    roles: i.entity({
      type: i.string().indexed(),
    }),
    products: i.entity({
      name: i.string(),
      slug: i.string().unique().indexed(),
      description: i.string(),
      priceCents: i.number().indexed(),
      compareAtPriceCents: i.number().indexed().optional(),
      featured: i.boolean().indexed().optional(),
      inStock: i.boolean().indexed().optional(),
      createdAt: i.number().indexed(),
    }),
    categories: i.entity({
      name: i.string().unique().indexed(),
      slug: i.string().unique().indexed(),
      description: i.string().optional(),
    }),
    profiles: i.entity({
      ownerId: i.string().indexed(),
      displayName: i.string().optional(),
      phone: i.string().optional(),
      createdAt: i.number(),
    }),
    addresses: i.entity({
      ownerId: i.string().indexed(),
      label: i.string().optional(),
      fullName: i.string(),
      houseNo: i.string(),
      road: i.string().optional(),
      area: i.string(),
      district: i.string(),
      division: i.string(),
      postalCode: i.string(),
      country: i.string().optional(),
      isDefault: i.boolean().optional(),
      createdAt: i.number().indexed(),
    }),
    orders: i.entity({
      ownerId: i.string().indexed(),
      status: i.string().indexed(),
      totalCents: i.number(),
      createdAt: i.number().indexed(),
    }),
    orderItems: i.entity({
      quantity: i.number(),
      priceCents: i.number(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    userRoles: {
      forward: {
        on: "$users",
        has: "many",
        label: "roles",
      },
      reverse: {
        on: "roles",
        has: "many",
        label: "users",
      },
    },
    productCategory: {
      forward: {
        on: "products",
        has: "one",
        label: "category",
      },
      reverse: {
        on: "categories",
        has: "many",
        label: "products",
      },
    },
    productImage: {
      forward: {
        on: "products",
        has: "one",
        label: "image",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "products",
      },
    },
    profileAvatar: {
      forward: {
        on: "profiles",
        has: "one",
        label: "avatar",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "profiles",
      },
    },
    orderItems: {
      forward: {
        on: "orders",
        has: "many",
        label: "items",
      },
      reverse: {
        on: "orderItems",
        has: "one",
        label: "order",
        onDelete: "cascade",
      },
    },
    orderItemProduct: {
      forward: {
        on: "orderItems",
        has: "one",
        label: "product",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "orderItems",
      },
    },
  },
  rooms: {},
})

// This helps TypeScript display nicer intellisense
export type AppSchema = typeof _schema
const schema: AppSchema = _schema

export default schema
