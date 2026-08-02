<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BUYBRO

E-commerce webapp selling gadgets (more product categories planned). Stack: Next.js 16.2.6 (App Router), React 19, Tailwind v4, shadcn/ui, InstantDB (data + files), next-themes. Package manager is **bun** (`bun.lock`).

## Commands & verification

- `bun run dev` — Next dev server (Turbopack)
- `bun run lint` — ESLint (flat config)
- `bun run typecheck` — `tsc --noEmit`
- `bun run format` — Prettier on `**/*.{ts,tsx}`
- `bun run build` — production build
- There is **no test framework**. Verify with `lint` → `typecheck` → `build`.

## Code style

`.prettierrc` is non-default: **no semicolons, double quotes**, trailing commas `es5`, print width 80, `prettier-plugin-tailwindcss` (with `cn`/`cva` recognized). Write code to match this; run `bun run format` after changes.

## shadcn/ui (Base UI, not Radix)

`components.json` uses style `base-sera` on top of `@base-ui/react`. Do NOT assume Radix/`asChild` APIs — Base UI uses `render={<Component />}` props, `items` arrays on Select, array `defaultValue` on ToggleGroup/Accordion, etc. Before adding or touching components, load the **shadcn** skill at `.agents/skills/shadcn/` (see `rules/base-vs-radix.md`).

- Add components: `npx shadcn@latest add <name>` → lands in `components/ui/`
- Aliases: `@/*` → repo root, `cn` in `@/lib/utils`, UI in `components/ui/`
- Styling tokens (colors, radius) are oklch CSS vars in `app/globals.css` — use theme tokens, not hardcoded colors. `d` key toggles dark mode.

## InstantDB (data + files)

Schema and permissions live at the repo root in `instant.schema.ts` and `instant.perms.ts`. Env: `.env` (gitignored — never commit) has `NEXT_PUBLIC_INSTANT_APP_ID` and `INSTANT_APP_ADMIN_TOKEN`.

- After editing schema/perms, push to the cloud: `npx instant-cli push schema --yes` and `npx instant-cli push perms --yes`
- Any field filtered or ordered in a query must be `indexed()` in the schema
- For product images/files use Instant Storage (`db.storage.uploadFile`), which creates `$files` entities — don't store fake URLs as string attrs
- Load the **instantdb** skill at `.agents/skills/instantdb/` for full query/permission/storage rules before working with Instant
- Client is not initialized yet — no `lib/clientDb`; create it with `init({ appId, schema })` before first use

## Architecture status

Currently a boilerplate scaffold (`app/page.tsx` placeholder). `lib/`, `hooks/`, `components/` are mostly empty. No products/cart/checkout entities exist in the schema yet — add them to `instant.schema.ts` as features land.
