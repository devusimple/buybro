import { init, id } from "@instantdb/admin"

import schema from "../instant.schema"

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID
const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN

if (!appId || !adminToken) {
  console.error(
    "Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_APP_ADMIN_TOKEN in .env"
  )
  process.exit(1)
}

const db = init({ appId, adminToken, schema })

type CategorySeed = {
  name: string
  slug: string
  description?: string
}

type ProductSeed = {
  name: string
  slug: string
  description: string
  priceCents: number
  compareAtPriceCents?: number
  featured?: boolean
  inStock?: boolean
  categorySlug: string
}

const categories: CategorySeed[] = [
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones, earbuds and speakers",
  },
  {
    name: "Wearables",
    slug: "wearables",
    description: "Watches, bands and rings",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Slim workhorses and power machines",
  },
  {
    name: "Phones",
    slug: "phones",
    description: "Flagships and everyday 5G",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Keyboards, chargers and desk gear",
  },
]

const products: ProductSeed[] = [
  {
    name: "Studio Wireless Headphones",
    slug: "studio-wireless-headphones",
    description:
      "Over-ear active noise cancelling with 40 hours of battery and rich, balanced sound. Fold-flat for travel.",
    priceCents: 24999,
    compareAtPriceCents: 29999,
    featured: true,
    inStock: true,
    categorySlug: "audio",
  },
  {
    name: "AirPulse Earbuds Pro",
    slug: "airpulse-earbuds-pro",
    description:
      "True wireless earbuds with adaptive ANC, wireless charging case and a feather-light fit.",
    priceCents: 17999,
    compareAtPriceCents: 22999,
    featured: true,
    inStock: true,
    categorySlug: "audio",
  },
  {
    name: "BoomBox Mini Speaker",
    slug: "boombox-mini-speaker",
    description:
      "A pocket-sized speaker with surprisingly big bass, IPX7 waterproofing and 16 hours of playtime.",
    priceCents: 8999,
    inStock: true,
    categorySlug: "audio",
  },
  {
    name: "Pulse Smartwatch 5",
    slug: "pulse-smartwatch-5",
    description:
      "AMOLED display, GPS, sleep tracking and a 7-day battery. Your training partner on every wrist.",
    priceCents: 32999,
    compareAtPriceCents: 37999,
    featured: true,
    inStock: true,
    categorySlug: "wearables",
  },
  {
    name: "FitBand Activity Tracker",
    slug: "fitband-activity-tracker",
    description:
      "A slim tracker that counts steps, heart rate and workouts without weighing your wrist down.",
    priceCents: 5999,
    inStock: true,
    categorySlug: "wearables",
  },
  {
    name: "RingFit Smart Ring",
    slug: "ringfit-smart-ring",
    description:
      "Continuous health insights packed into a titanium ring. Sleep, recovery and readiness scores.",
    priceCents: 12999,
    inStock: false,
    categorySlug: "wearables",
  },
  {
    name: "SlimBook Ultra 14",
    slug: "slimbook-ultra-14",
    description:
      "A 14-inch laptop that weighs under a kilogram with an all-day battery and a brilliant display.",
    priceCents: 129999,
    featured: true,
    inStock: true,
    categorySlug: "laptops",
  },
  {
    name: "Titan Gaming Laptop 16",
    slug: "titan-gaming-laptop-16",
    description:
      "16-inch 240Hz panel, next-gen GPU and vapor chamber cooling. Built to win, made to last.",
    priceCents: 219999,
    inStock: true,
    categorySlug: "laptops",
  },
  {
    name: "Vertex X1 Pro",
    slug: "vertex-x1-pro",
    description:
      "Flagship phone with a pro-grade triple camera, 120Hz display and three-day battery stamina.",
    priceCents: 89999,
    compareAtPriceCents: 99999,
    featured: true,
    inStock: true,
    categorySlug: "phones",
  },
  {
    name: "Nova Lite 5G",
    slug: "nova-lite-5g",
    description:
      "Everyday 5G on a budget — smooth display, dependable camera and battery that keeps up.",
    priceCents: 34999,
    inStock: true,
    categorySlug: "phones",
  },
  {
    name: "MechKey 75 Keyboard",
    slug: "mechkey-75-keyboard",
    description:
      "A 75% hot-swappable mechanical keyboard with gasket mount, PBT keycaps and a rotary knob.",
    priceCents: 12999,
    compareAtPriceCents: 15999,
    inStock: true,
    categorySlug: "accessories",
  },
  {
    name: "PowerDock Wireless Charger",
    slug: "powerdock-wireless-charger",
    description:
      "Fast-charge your phone, earbuds and watch at once on one sleek three-in-one dock.",
    priceCents: 6999,
    inStock: true,
    categorySlug: "accessories",
  },
]

const categoryPalettes: Record<string, [string, string]> = {
  audio: ["#4f46e5", "#7c3aed"],
  wearables: ["#0d9488", "#10b981"],
  laptops: ["#0f172a", "#1e3a8a"],
  phones: ["#7c3aed", "#db2777"],
  accessories: ["#b45309", "#d97706"],
}

function makeSvg(title: string, label: string, from: string, to: string) {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  const safeLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <rect x="32" y="32" width="736" height="736" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  <text x="400" y="388" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="700" letter-spacing="6" fill="rgba(255,255,255,0.92)" text-anchor="middle">${safeTitle}</text>
  <text x="400" y="448" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" letter-spacing="10" fill="rgba(255,255,255,0.6)" text-anchor="middle">${safeLabel}</text>
</svg>`
}

async function main() {
  console.log("Seeding categories...")
  const categoryIds = new Map<string, string>()

  for (const category of categories) {
    const existing = await db.query({
      categories: { $: { where: { slug: category.slug } } },
    })
    if (existing.categories.length > 0) {
      categoryIds.set(category.slug, existing.categories[0].id)
      console.log(`  - ${category.name} (exists)`)
      continue
    }
    const categoryId = id()
    await db.transact(
      db.tx.categories[categoryId].create({
        name: category.name,
        slug: category.slug,
        description: category.description,
      })
    )
    categoryIds.set(category.slug, categoryId)
    console.log(`  + ${category.name}`)
  }

  console.log("Seeding products...")
  const now = Date.now()
  let created = 0
  let skipped = 0

  for (const product of products) {
    const existing = await db.query({
      products: { $: { where: { slug: product.slug } } },
    })
    if (existing.products.length > 0) {
      skipped += 1
      console.log(`  - ${product.name} (exists)`)
      continue
    }

    const categoryId = categoryIds.get(product.categorySlug)
    if (!categoryId) {
      console.warn(
        `  ! Skipping ${product.name}: unknown category ${product.categorySlug}`
      )
      continue
    }

    const [from, to] = categoryPalettes[product.categorySlug] ?? [
      "#334155",
      "#0f172a",
    ]
    const svg = makeSvg(
      product.name.toUpperCase(),
      (
        categories.find((c) => c.slug === product.categorySlug)?.name ?? ""
      ).toUpperCase(),
      from,
      to
    )

    const filePath = `products/${product.slug}.svg`
    const { data: file } = await db.storage.uploadFile(
      filePath,
      Buffer.from(svg),
      {
        contentType: "image/svg+xml",
      }
    )

    const productId = id()
    await db.transact(
      db.tx.products[productId]
        .create({
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          compareAtPriceCents: product.compareAtPriceCents,
          featured: product.featured ?? false,
          inStock: product.inStock ?? true,
          createdAt: now,
        })
        .link({ image: file.id, category: categoryId })
    )
    created += 1
    console.log(`  + ${product.name}`)
  }

  console.log(`\nDone. Created ${created} products, skipped ${skipped}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
