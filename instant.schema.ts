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
      richDescription: i.string().optional(),
      sku: i.string().optional(),
      priceCents: i.number().indexed(),
      compareAtPriceCents: i.number().indexed().optional(),
      featured: i.boolean().indexed().optional(),
      inStock: i.boolean().indexed().optional(),
      stock: i.number().optional(),
      rating: i.number().indexed().optional(),
      reviewCount: i.number().indexed().optional(),
      createdAt: i.number().indexed(),
    }),
    productVariants: i.entity({
      title: i.string(),
      value: i.string(),
      sku: i.string().optional(),
      priceCents: i.number().optional(),
      stock: i.number().optional(),
    }),
    reviews: i.entity({
      authorName: i.string(),
      authorEmail: i.string().optional(),
      rating: i.number().indexed(),
      comment: i.string().optional(),
      verified: i.boolean().optional(),
      createdAt: i.number().indexed(),
    }),
    wishlists: i.entity({
      ownerId: i.string().indexed(),
      createdAt: i.number(),
    }),
    coupons: i.entity({
      code: i.string().unique().indexed(),
      discountType: i.string(),
      value: i.number(),
      minSubtotalCents: i.number().optional(),
      maxDiscountCents: i.number().optional(),
      active: i.boolean().indexed().optional(),
      startsAt: i.number().optional(),
      expiresAt: i.number().optional(),
      usageLimit: i.number().optional(),
      createdAt: i.number(),
    }),
    couponUsages: i.entity({
      code: i.string().indexed(),
      orderId: i.string().unique().indexed(),
      createdAt: i.number(),
    }),
    categories: i.entity({
      name: i.string().unique().indexed(),
      slug: i.string().unique().indexed(),
      description: i.string().optional(),
    }),
    collections: i.entity({
      name: i.string().unique().indexed(),
      slug: i.string().unique().indexed(),
      description: i.string().optional(),
      sortOrder: i.number().indexed().optional(),
    }),
    banners: i.entity({
      title: i.string(),
      subtitle: i.string().optional(),
      ctaLabel: i.string().optional(),
      ctaHref: i.string().optional(),
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
      ownerEmail: i.string().indexed().optional(),
      status: i.string().indexed(),
      totalCents: i.number(),
      subtotalCents: i.number().optional(),
      discountCents: i.number().optional(),
      couponCode: i.string().indexed().optional(),
      shippingFullName: i.string().optional(),
      shippingPhone: i.string().optional(),
      shippingHouseNo: i.string().optional(),
      shippingRoad: i.string().optional(),
      shippingArea: i.string().optional(),
      shippingDistrict: i.string().optional(),
      shippingDivision: i.string().optional(),
      shippingPostalCode: i.string().optional(),
      shippingCountry: i.string().optional(),
      createdAt: i.number().indexed(),
    }),
    orderItems: i.entity({
      quantity: i.number(),
      priceCents: i.number(),
      name: i.string().optional(),
      variant: i.string().optional(),
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
    categoryParent: {
      forward: {
        on: "categories",
        has: "one",
        label: "parent",
      },
      reverse: {
        on: "categories",
        has: "many",
        label: "children",
      },
    },
    productCollections: {
      forward: {
        on: "collections",
        has: "many",
        label: "products",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "collections",
      },
    },
    bannerImage: {
      forward: {
        on: "banners",
        has: "one",
        label: "image",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "banners",
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
    productGallery: {
      forward: {
        on: "products",
        has: "many",
        label: "gallery",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "productGallery",
      },
    },
    productVariant: {
      forward: {
        on: "productVariants",
        has: "one",
        label: "product",
        onDelete: "cascade",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "variants",
      },
    },
    reviewProduct: {
      forward: {
        on: "reviews",
        has: "one",
        label: "product",
        onDelete: "cascade",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "reviews",
      },
    },
    reviewAuthor: {
      forward: {
        on: "reviews",
        has: "one",
        label: "author",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "reviews",
      },
    },
    wishlistProduct: {
      forward: {
        on: "wishlists",
        has: "many",
        label: "products",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "wishlists",
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
