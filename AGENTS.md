<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BUYBRO

E-commerce webapp selling gadgets (more product categories planned — fashion seed data included). Stack: Next.js 16.2.6 (App Router), React 19, Tailwind v4, shadcn/ui (Base UI, `base-sera` style), InstantDB (data + files + auth), zustand (client state), next-themes (dark mode), recharts (admin charts), lucide-react (icons). Package manager is **bun** (`bun.lock`). No test framework.

## Project status

Fully functional storefront + admin, not a boilerplate. Storefront: home feed, search, category tree, collection pages, product detail (gallery/variants/reviews/FAQs), wishlist, cart, checkout, profile (info/avatar/addresses/orders/notifications), warranty & returns policies. Admin: dashboard (stats/revenue/low-stock/top products), products CRUD + CSV import/export + draft/publish, categories (nested), collections, coupons, banners, orders (status updates), reviews moderation, users, files (usage tracking). i18n: English + Bengali.

## Commands & verification

- `bun run dev` — Next dev server (Turbopack)
- `bun run build` / `bun run start` — production build / serve
- `bun run lint` — ESLint (flat config, `eslint.config.mjs`)
- `bun run typecheck` — `tsc --noEmit`
- `bun run format` — Prettier on `**/*.{ts,tsx}`
- `bun run seed` — `bun scripts/seed.ts` (admin SDK; seeds categories, collections, banners, coupons, products with variants/FAQs, uploads demo images to Instant Storage)
- There is **no test framework**. Verify with `lint` → `typecheck` → `build`.

## Environment

`.env` is gitignored — **never commit it**. Required vars:

- `NEXT_PUBLIC_INSTANT_APP_ID`
- `INSTANT_APP_ADMIN_TOKEN`

`next.config.ts` allows LAN dev origins (`192.168.0.10x`) and remote image hosts `files.instantdb.com` / `instant-storage.s3.amazonaws.com`. If you add remote images, add the hostname to `images.remotePatterns`.

## Routing & architecture

- **Locale middleware** (`proxy.ts`): every public route lives under `/[lang]` (`en`/`bn`). Non-locale requests redirect to the cookie (`buybro-locale`) or `accept-language` locale. Don't add top-level public pages outside `app/[lang]`.
- **Storefront** (`app/[lang]/`): `page.tsx` (home feed), `search/`, `categories/` + `categories/[slug]`, `collections/[slug]`, `products/[slug]`, `checkout/`, `profile/` (+ `profile/orders/[orderId]`), `policies/warranty`, `policies/returns`.
- **Admin** (`app/[lang]/(admin)/admin/`): server-gated by `(admin)/layout.tsx`, which verifies the Instant auth cookie against the admin SDK and renders `<AdminAuth />` (magic-code sign-in) when the user lacks the `admin` role. Everything under this route group is client components. Admin pages: dashboard, `products` (+ `new`, `[id]/edit`), `categories` (+ `new`, `[id]/edit`), `coupons` (+ `new`, `[id]/edit`), `banners` (+ `new`, `[id]/edit`), `orders`, `reviews`, `users`, `files`.
- **API routes** (`app/api/`), all Node runtime:
  - `POST /api/instant` — Instant first-party handler (`createInstantRouteHandler`). Client Instant calls go through here (see `lib/clientDb.ts`).
  - `POST /api/checkout` — server-side order placement with the **admin SDK**: verifies the refresh token, validates items/quantities against live stock, applies coupons, computes totals, decrements stock, writes `orders` + `orderItems` + `couponUsages` + a notification. Client can never write orders directly.
  - `POST /api/reviews` — server-side review creation with the admin SDK: validates rating (1–5) and media, links review media, recomputes the product's `rating`/`reviewCount`.

## Data layer — InstantDB

Schema and permissions are source-controlled at the repo root:

- `instant.schema.ts` — entities + links (`i.schema(...)`, typed as `AppSchema`)
- `instant.perms.ts` — CEL permission rules (`InstantRules`)

**Two Instant clients — keep them separate:**

- `lib/clientDb.ts` — browser client: `init({ appId, firstPartyPath: "/api/instant", schema })`. Used in client components, hooks, and client libs.
- `lib/adminDb.ts` — **server-only** admin client: `init({ appId, adminToken, schema })`. Used only in API routes, the admin layout gate, and the seed script. **Never import it from a client component or hook.**

### Schema summary

`$files`, `$streams`, `$users`, `roles`, `products`, `productVariants`, `reviews`, `productFaqs`, `wishlists`, `coupons`, `couponUsages`, `categories`, `collections`, `banners`, `profiles`, `addresses`, `orders`, `orderItems`, `notifications`.

**`products` fields:** `name`, `slug` (unique, indexed), `description`, `richDescription`, `sku`, `priceCents` (indexed), `compareAtPriceCents` (indexed), `featured`, `inStock`, `status` (`"draft" | "active"`, indexed, optional), `stock`, `rating`, `reviewCount`, `createdAt`.

**`products` links:** `category` (one), `image` (one `$files`), `gallery` (many `$files`), `variants` (many `productVariants`), `collections` (many), `faqs` (many `productFaqs`), `reviews` (many), `wishlists` (many), `orderItems` (many).

### InstantDB rules (critical)

- **Index everything you filter/order by.** Any field used in a query `where` or `order` must be `indexed()` in the schema or the query errors.
- **After editing schema/perms, push to the cloud:** `npx instant-cli push schema --yes` and `npx instant-cli push perms --yes`. Missing field = deletion, so re-check references.
- **Files go through Instant Storage, never fake URLs.** `db.storage.uploadFile` creates `$files` entities; link them via schema links and read URLs through the relation. You cannot create `$files` via `transact`, and `url` is never set by hand.
- **`$ne` includes missing fields.** Storefronts hide drafts with `status: { $ne: "draft" }`; products without a `status` (legacy data) still show. Don't switch this to `$isNull`/`$in` patterns without checking existing data.
- **Only admins write products/variants/FAQs/coupons/banners/collections/categories** (see perms). Stock decrements, ratings, and order writes run server-side only.
- `$files` create/delete is owner-or-admin and path-scoped (`data.path.startsWith(auth.id + "/")`), view is public.
- Load the **instantdb** skill at `.agents/skills/instantdb/` before working with queries, permissions, or storage.

## Product draft / publish

- `status` drives visibility. `"draft"` = hidden from storefront, `"active"` (or missing) = published.
- Product form has **Save draft** (outline) and **Save & publish** (primary) buttons; the edit page shows a Draft/Published badge.
- Admin product list has a Draft badge and an eye/eye-off quick publish/unpublish toggle.
- Admin product queries **do not** filter drafts — admin must see everything. Storefront queries do.

## Business rules & conventions

- **Money is integer cents.** `priceCents`, `compareAtPriceCents`, `totalCents`, `subtotalCents`, `discountCents`. Parse strings with `parseFloat`, round with `Math.round(x * 100)`, format with `formatPrice()` (`lib/format.ts`). Never store floats as money.
- **Cart** (`lib/cart-store.ts`): zustand + persist (`localStorage` key `buybro-cart`). Line id = `${product.id}::${variant}` for variants, else product id. Quantities cap at snapshot `stock`. Items are price/variant snapshots taken at add time — the server re-validates at checkout.
- **Checkout** (`lib/orders.ts`, `POST /api/checkout`): payment `cod` | `online`; shipping snapshot copied from the address; coupons validated server-side. Order statuses: `pending → confirmed → shipped → delivered`, or `cancelled` (buyer may only cancel; admin controls everything else).
- **Coupons** (`lib/coupons.ts`): codes normalized uppercase/whitespace-stripped; `percent` (capped by `maxDiscountCents`) or `flat`; validation via `couponError()` (inactive / not started / expired / min subtotal / fully used).
- **Reviews** (`POST /api/reviews`): 1–5 integer rating, media links, helpful-count vote allowed from signed-in users (client), admin replies via admin. Product `rating`/`reviewCount` recompute on the server.
- **Wishlist** (`lib/wishlist.ts`): one wishlist per user; toggling the last item deletes the wishlist.
- **Recently viewed & recent searches**: localStorage libs `lib/recent.ts` and `lib/search-history.ts`. Never import in server code.
- **Notifications** (`lib/notifications.ts`): `notifyOrderStatus()` writes order-status notifications to the owner.

## Auth

- InstantDB magic-code auth; guests supported. Sign-in flows in `components/auth/sign-in-form.tsx` and `components/admin/admin-auth.tsx`.
- Admin = `$users` linked to a `roles` entity with `type: "admin"`. Grant roles via the admin SDK (seed/CLI), never client-side.
- Admin gating is **server-side** in `(admin)/layout.tsx`. After a successful magic-code sign-in, `AdminAuth` triggers `router.refresh()` so the server layout re-checks the role.

## i18n

- Config: `lib/i18n/config.ts` (locales `en`/`bn`, default `en`, cookie `buybro-locale`). Dictionaries: `lib/i18n/dictionaries/en.ts` and `bn.ts`, typed by `Messages` (typeof en) — **bn must stay key-for-key identical to en**.
- Use `useI18n()` → `{ t, locale }`. Never hardcode user-facing strings in components; add a key to both dictionaries. Placeholder interpolation: `t("key", { count })`.

## Styling & components

- **shadcn/ui on Base UI, not Radix.** Do NOT assume Radix/`asChild` APIs — Base UI uses `render={<Component />}` props, `items` arrays on `Select`, array `defaultValue` on `ToggleGroup`/`Accordion`, etc. Load the **shadcn** skill at `.agents/skills/shadcn/` (see `rules/base-vs-radix.md`) before adding or touching components.
- Add components: `npx shadcn@latest add <name>` → lands in `components/ui/`.
- Aliases: `@/*` → repo root, `cn` in `@/lib/utils`, UI in `components/ui/`.
- **Theme tokens only.** Colors/radius are oklch CSS vars in `app/globals.css` — use tokens (`bg-background`, `text-muted-foreground`, `border-destructive`…), never hardcoded colors. `d` key toggles dark mode.
- Custom/admin components live under `components/` (e.g. `components/admin/`, `components/product/`, `components/home/`).

## Code style

`.prettierrc` is non-default: **no semicolons, double quotes**, trailing commas `es5`, print width 80, `prettier-plugin-tailwindcss` (with `cn`/`cva` recognized). Write code to match; run `bun run format` after changes. Rich text is sanitized before storage with `lib/sanitize.ts` (allowlist of tags/attrs; strips `on*` handlers; anchors forced `target=_blank rel=noopener noreferrer`).

## Security regulations (rules of the road)

1. **Never commit secrets or `.env`.** Admin token gives full backend access.
2. **Never trust the client for money or stock.** Orders, stock decrements, rating recomputes, coupon usage, and review creation all happen server-side with the admin SDK.
3. **Permission default is deny** (`instant.perms.ts` `$default`). Every namespace explicitly opts in. Don't relax rules without a reason; don't add client-writable money/stock fields.
4. **Sanitize all rich HTML before persisting and before rendering** (`sanitizeHtml`).
5. **CSV exports neutralize formula injection** (`lib/csv.ts` prefixes `= + - @` cells).
6. Keep client queries scoped (fields, `where`) — drafts and other private data must be filtered in the query, not just in the UI.
7. Only admin SDK writes to `roles`/orders; never self-assign roles from the client.
