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

const DAY = 86_400_000

type CouponSeed = {
  code: string
  discountType: "percent" | "flat"
  value: number
  minSubtotalCents?: number
  maxDiscountCents?: number
  usageLimit?: number
  startsAt?: number
  expiresAt?: number
  active?: boolean
}

const coupons: CouponSeed[] = [
  {
    code: "WELCOME10",
    discountType: "percent",
    value: 10,
    maxDiscountCents: 1000,
    usageLimit: 500,
    active: true,
  },
  {
    code: "FLASH20",
    discountType: "percent",
    value: 20,
    minSubtotalCents: 5000,
    maxDiscountCents: 2500,
    expiresAt: Date.now() + 30 * DAY,
    usageLimit: 200,
    active: true,
  },
  {
    code: "SAVE500",
    discountType: "flat",
    value: 500,
    minSubtotalCents: 3000,
    expiresAt: Date.now() + 60 * DAY,
    usageLimit: 100,
    active: true,
  },
]

type CategoryNode = {
  name: string
  slug: string
  description?: string
  children?: CategoryNode[]
}

const categoryTree: CategoryNode[] = [
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, bags and accessories for every wardrobe.",
    children: [
      {
        name: "Men's Clothing",
        slug: "mens-clothing",
        children: [
          { name: "T-Shirts", slug: "t-shirts" },
          { name: "Shirts", slug: "shirts" },
          { name: "Polo Shirts", slug: "polo-shirts" },
          { name: "Hoodies", slug: "hoodies" },
          { name: "Jackets", slug: "jackets" },
          { name: "Jeans", slug: "jeans" },
          { name: "Trousers", slug: "trousers" },
          { name: "Shorts", slug: "shorts" },
          { name: "Traditional Wear", slug: "traditional-wear" },
        ],
      },
      {
        name: "Women's Clothing",
        slug: "womens-clothing",
        children: [
          { name: "Dresses", slug: "dresses" },
          { name: "Tops", slug: "tops" },
          { name: "Sarees", slug: "sarees" },
          { name: "Kurtis", slug: "kurtis" },
          { name: "Hijabs", slug: "hijabs" },
          { name: "Leggings", slug: "leggings" },
        ],
      },
      { name: "Kids & Baby Clothing", slug: "kids-baby-clothing" },
      { name: "Jerseys", slug: "jerseys" },
      { name: "Shoes", slug: "shoes" },
      { name: "Sandals", slug: "sandals" },
      { name: "Bags", slug: "bags" },
      { name: "Wallets", slug: "wallets" },
      { name: "Sunglasses", slug: "sunglasses" },
      { name: "Watches", slug: "watches" },
      { name: "Belts", slug: "belts" },
      { name: "Hats & Caps", slug: "hats-caps" },
    ],
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, laptops, networking and everyday gadgets.",
    children: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Feature Phones", slug: "feature-phones" },
      { name: "Tablets", slug: "tablets" },
      { name: "Laptops", slug: "laptops" },
      { name: "Desktop PCs", slug: "desktop-pcs" },
      { name: "Monitors", slug: "monitors" },
      { name: "Keyboards", slug: "keyboards" },
      { name: "Mouse", slug: "mouse" },
      { name: "Printers", slug: "printers" },
      {
        name: "Networking",
        slug: "networking",
        children: [
          { name: "Routers", slug: "routers" },
          { name: "Switches", slug: "switches" },
          { name: "Wi-Fi Extenders", slug: "wi-fi-extenders" },
        ],
      },
      {
        name: "Storage",
        slug: "storage",
        children: [
          { name: "SSD", slug: "ssd" },
          { name: "HDD", slug: "hdd" },
          { name: "USB Drives", slug: "usb-drives" },
          { name: "Memory Cards", slug: "memory-cards" },
        ],
      },
      { name: "Computer Accessories", slug: "computer-accessories" },
      { name: "Mobile Accessories", slug: "mobile-accessories" },
      { name: "Chargers", slug: "chargers" },
      { name: "Power Banks", slug: "power-banks" },
      { name: "Cables", slug: "cables" },
      { name: "Smart Home", slug: "smart-home" },
    ],
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Consoles, peripherals and gear for serious play.",
    children: [
      { name: "Consoles", slug: "consoles" },
      { name: "PC Gaming", slug: "pc-gaming" },
      { name: "Controllers", slug: "controllers" },
      { name: "Gaming Keyboards", slug: "gaming-keyboards" },
      { name: "Gaming Mouse", slug: "gaming-mouse" },
      { name: "Gaming Chairs", slug: "gaming-chairs" },
      { name: "VR", slug: "vr" },
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Furniture, appliances, decor and everyday essentials.",
    children: [
      { name: "Furniture", slug: "furniture" },
      { name: "Home Decor", slug: "home-decor" },
      { name: "Kitchen Appliances", slug: "kitchen-appliances" },
      { name: "Cookware", slug: "cookware" },
      { name: "Dinnerware", slug: "dinnerware" },
      { name: "Home Storage", slug: "home-storage" },
      { name: "Cleaning Supplies", slug: "cleaning-supplies" },
      { name: "Lighting", slug: "lighting" },
    ],
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare, haircare, makeup and grooming essentials.",
    children: [
      { name: "Skincare", slug: "skincare" },
      { name: "Hair Care", slug: "hair-care" },
      { name: "Makeup", slug: "makeup" },
      { name: "Perfumes", slug: "perfumes" },
      { name: "Men's Grooming", slug: "mens-grooming" },
      { name: "Personal Hygiene", slug: "personal-hygiene" },
    ],
  },
  {
    name: "Office & Stationery",
    slug: "office-stationery",
    description: "Pens, notebooks and supplies to get things done.",
    children: [
      { name: "Pens", slug: "pens" },
      { name: "Notebooks", slug: "notebooks" },
      { name: "Office Supplies", slug: "office-supplies" },
      { name: "School Supplies", slug: "school-supplies" },
      { name: "Art Supplies", slug: "art-supplies" },
    ],
  },
  {
    name: "Toys & Baby",
    slug: "toys-baby",
    description: "Toys, learning kits and baby essentials.",
    children: [
      { name: "Toys", slug: "toys" },
      { name: "Educational Toys", slug: "educational-toys" },
      { name: "Baby Clothing", slug: "baby-clothing" },
      { name: "Diapers", slug: "diapers" },
      { name: "Baby Care", slug: "baby-care" },
      { name: "Strollers", slug: "strollers" },
    ],
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "Car and bike accessories, tires, fluids and tools.",
    children: [
      { name: "Car Accessories", slug: "car-accessories" },
      { name: "Motorcycle Accessories", slug: "motorcycle-accessories" },
      { name: "Tires", slug: "tires" },
      { name: "Oils & Fluids", slug: "oils-fluids" },
      { name: "Tools", slug: "automotive-tools" },
      { name: "Spare Parts", slug: "spare-parts" },
    ],
  },
  {
    name: "Industrial & Tools",
    slug: "industrial-tools",
    description: "Hand tools, power tools and safety equipment.",
    children: [
      { name: "Hand Tools", slug: "hand-tools" },
      { name: "Power Tools", slug: "power-tools" },
      { name: "Safety Equipment", slug: "safety-equipment" },
      { name: "Building Materials", slug: "building-materials" },
    ],
  },
  {
    name: "Digital Products",
    slug: "digital-products",
    description: "Software, eBooks, courses, templates and gift cards.",
    children: [
      { name: "Software", slug: "software" },
      { name: "eBooks", slug: "ebooks" },
      { name: "Online Courses", slug: "online-courses" },
      { name: "Templates", slug: "templates" },
      { name: "Gift Cards", slug: "gift-cards" },
    ],
  },
]

type FlatCategory = {
  name: string
  slug: string
  description?: string
  parentSlug?: string
}

const flatCategories: FlatCategory[] = []
function flatten(nodes: CategoryNode[], parentSlug?: string) {
  for (const node of nodes) {
    flatCategories.push({
      name: node.name,
      slug: node.slug,
      description: node.description,
      parentSlug,
    })
    if (node.children) {
      flatten(node.children, node.slug)
    }
  }
}
flatten(categoryTree)

const collections = [
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh off the shelf.",
    sortOrder: 0,
  },
  {
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Customers' favourites.",
    sortOrder: 1,
  },
  {
    name: "Trending",
    slug: "trending",
    description: "What everyone is after.",
    sortOrder: 2,
  },
  {
    name: "Flash Sale",
    slug: "flash-sale",
    description: "Limited-time deals.",
    sortOrder: 3,
  },
]

type ProductSeed = {
  name: string
  slug: string
  description: string
  priceCents: number
  compareAtPriceCents?: number
  featured?: boolean
  inStock?: boolean
  stock?: number
  categorySlug: string
  collectionSlugs: string[]
  variants?: VariantSeed[]
  daysAgo: number
}

const products: ProductSeed[] = [
  // New arrivals
  {
    name: "Aurora Smart Glasses",
    slug: "aurora-smart-glasses",
    description:
      "AR glasses with a discreet display, bone-conduction audio and a feather-light frame.",
    priceCents: 24999,
    compareAtPriceCents: 29999,
    featured: true,
    categorySlug: "computer-accessories",
    collectionSlugs: ["new-arrivals", "trending"],
    daysAgo: 0,
  },
  {
    name: "Cozy Fleece Hoodie",
    slug: "cozy-fleece-hoodie",
    description:
      "Brushed fleece, dropped shoulders and a relaxed fit that keeps you warm all season.",
    priceCents: 1899,
    categorySlug: "hoodies",
    collectionSlugs: ["new-arrivals", "best-sellers"],
    variants: [
      { title: "Color", value: "Charcoal", stock: 40 },
      { title: "Color", value: "Olive", stock: 25 },
      { title: "Color", value: "Sand", stock: 18 },
      { title: "Size", value: "S", stock: 12 },
      { title: "Size", value: "M", stock: 30 },
      { title: "Size", value: "L", stock: 28 },
      { title: "Size", value: "XL", stock: 14 },
    ],
    daysAgo: 1,
  },
  {
    name: "UltraSlim Power Bank 20K",
    slug: "ultraslim-power-bank-20k",
    description:
      "20,000mAh of fast charging in a pocket-friendly slab that tops up two phones at once.",
    priceCents: 2499,
    compareAtPriceCents: 3299,
    stock: 3,
    categorySlug: "power-banks",
    collectionSlugs: ["new-arrivals", "flash-sale"],
    variants: [
      { title: "Color", value: "Black", stock: 60 },
      { title: "Color", value: "White", stock: 35 },
      { title: "Color", value: "Sage", stock: 0 },
    ],
    daysAgo: 2,
  },
  {
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description:
      "A hand-glazed dripper, carafe and mug set for slow, delicious mornings.",
    priceCents: 3499,
    categorySlug: "kitchen-appliances",
    collectionSlugs: ["new-arrivals"],
    daysAgo: 3,
  },
  {
    name: "MechKey Keycap Set",
    slug: "mechkey-keycap-set",
    description:
      "Doubleshot PBT keycaps in a retro palette. A quick refresh for any mechanical board.",
    priceCents: 2999,
    categorySlug: "gaming-keyboards",
    collectionSlugs: ["new-arrivals"],
    daysAgo: 4,
  },
  {
    name: "Mini Projector 4K",
    slug: "mini-projector-4k",
    description:
      "A palm-sized 4K projector with auto focus, keystone and a 120-inch image.",
    priceCents: 22999,
    featured: true,
    categorySlug: "computer-accessories",
    collectionSlugs: ["new-arrivals", "trending"],
    daysAgo: 5,
  },
  {
    name: "Kids Building Blocks 500pc",
    slug: "kids-building-blocks-500pc",
    description:
      "500 colourful blocks that spark imagination, fine motor skills and hours of play.",
    priceCents: 1599,
    categorySlug: "educational-toys",
    collectionSlugs: ["new-arrivals"],
    daysAgo: 6,
  },
  {
    name: "Velvet Kurti Set",
    slug: "velvet-kurti-set",
    description:
      "An elegant velvet kurti with matching dupatta, made for festive evenings.",
    priceCents: 2299,
    categorySlug: "kurtis",
    collectionSlugs: ["new-arrivals"],
    daysAgo: 7,
  },
  {
    name: "Wireless Ergonomic Mouse",
    slug: "wireless-ergonomic-mouse",
    description:
      "Sculpted comfort, silent clicks and a battery that lasts six months.",
    priceCents: 1499,
    categorySlug: "mouse",
    collectionSlugs: ["new-arrivals", "best-sellers"],
    daysAgo: 8,
  },
  {
    name: "Floral Saree",
    slug: "floral-saree",
    description:
      "A lightweight floral saree with a soft drape and rich fall, ready for any occasion.",
    priceCents: 4999,
    categorySlug: "sarees",
    collectionSlugs: ["new-arrivals", "trending"],
    daysAgo: 9,
  },
  // Best sellers
  {
    name: "Everyday Sneakers",
    slug: "everyday-sneakers",
    description:
      "Cushioned, breathable and made for all-day wear. The pair you'll reach for daily.",
    priceCents: 4499,
    featured: true,
    stock: 12,
    categorySlug: "shoes",
    collectionSlugs: ["best-sellers", "trending"],
    daysAgo: 11,
  },
  {
    name: "SlimFit Jeans",
    slug: "slimfit-jeans",
    description:
      "Stretch denim with a clean slim cut that keeps its shape through the day.",
    priceCents: 2599,
    categorySlug: "jeans",
    collectionSlugs: ["best-sellers"],
    daysAgo: 12,
  },
  {
    name: "Leather Tote Bag",
    slug: "leather-tote-bag",
    description:
      "Genuine leather, brass hardware and room for a 14-inch laptop. Ages beautifully.",
    priceCents: 5999,
    categorySlug: "bags",
    collectionSlugs: ["best-sellers", "trending"],
    daysAgo: 13,
  },
  {
    name: "Polarized Sunglasses",
    slug: "polarized-sunglasses",
    description:
      "UV400 polarized lenses in a classic frame that suits every face.",
    priceCents: 1999,
    categorySlug: "sunglasses",
    collectionSlugs: ["best-sellers"],
    daysAgo: 14,
  },
  {
    name: "Bluetooth Neckband",
    slug: "bluetooth-neckband",
    description:
      "Feather-light neckband with 30 hours of playtime and a fast-charging USB-C port.",
    priceCents: 1299,
    categorySlug: "mobile-accessories",
    collectionSlugs: ["best-sellers"],
    daysAgo: 15,
  },
  {
    name: "Stand Mixer 5L",
    slug: "stand-mixer-5l",
    description:
      "A heavy-duty 1000W stand mixer with a 5-litre bowl — knead, whip and mix with ease.",
    priceCents: 7999,
    featured: true,
    categorySlug: "kitchen-appliances",
    collectionSlugs: ["best-sellers"],
    daysAgo: 16,
  },
  {
    name: "Water-Resistant Watch",
    slug: "water-resistant-watch",
    description:
      "A 50m water-resistant timepiece with a sapphire glass and steel bracelet.",
    priceCents: 6999,
    categorySlug: "watches",
    collectionSlugs: ["best-sellers"],
    daysAgo: 17,
  },
  {
    name: '27" Curved Monitor',
    slug: "curved-monitor-27",
    description:
      "A 1440p 165Hz curved display with slim bezels for work and play.",
    priceCents: 34999,
    compareAtPriceCents: 42999,
    categorySlug: "monitors",
    collectionSlugs: ["best-sellers", "flash-sale"],
    daysAgo: 18,
  },
  {
    name: "Cordless Drill 20V",
    slug: "cordless-drill-20v",
    description:
      "A brushless 20V drill with two batteries, a fast charger and a full accessory kit.",
    priceCents: 6499,
    categorySlug: "power-tools",
    collectionSlugs: ["best-sellers"],
    daysAgo: 19,
  },
  {
    name: "Stainless Cookware Set",
    slug: "stainless-cookware-set",
    description:
      "A tri-ply stainless set of 7 pieces that heats evenly and cleans easily.",
    priceCents: 8999,
    categorySlug: "cookware",
    collectionSlugs: ["best-sellers"],
    daysAgo: 20,
  },
  // Trending
  {
    name: "RGB Gaming Mouse",
    slug: "rgb-gaming-mouse",
    description:
      "A 26K DPI sensor, 8 programmable buttons and per-key RGB lighting.",
    priceCents: 2499,
    featured: true,
    categorySlug: "gaming-mouse",
    collectionSlugs: ["trending"],
    daysAgo: 22,
  },
  {
    name: "Smart Wi-Fi Bulb",
    slug: "smart-wi-fi-bulb",
    description:
      "16 million colours, schedules and voice control — screw in and smarten any room.",
    priceCents: 999,
    featured: true,
    categorySlug: "smart-home",
    collectionSlugs: ["trending"],
    daysAgo: 23,
  },
  {
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    description:
      "15W fast wireless charging with a soft-touch, anti-slip surface.",
    priceCents: 1499,
    compareAtPriceCents: 1999,
    categorySlug: "chargers",
    collectionSlugs: ["trending", "flash-sale"],
    daysAgo: 24,
  },
  {
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    description:
      "Adaptive ANC, a pocketable case and 30 hours of total playtime.",
    priceCents: 8999,
    compareAtPriceCents: 11999,
    featured: true,
    categorySlug: "mobile-accessories",
    collectionSlugs: ["trending", "flash-sale"],
    variants: [
      { title: "Color", value: "Midnight", priceCents: 8999, stock: 45 },
      { title: "Color", value: "Frost", priceCents: 9499, stock: 20 },
    ],
    daysAgo: 25,
  },
  {
    name: "Mechanical Keyboard 75%",
    slug: "mechanical-keyboard-75",
    description:
      "A gasket-mounted 75% board with hot-swap switches and a rotary knob.",
    priceCents: 12999,
    featured: true,
    categorySlug: "gaming-keyboards",
    collectionSlugs: ["trending", "best-sellers"],
    daysAgo: 26,
  },
  {
    name: "Facial Cleanser Duo",
    slug: "facial-cleanser-duo",
    description:
      "A gentle daily cleanser and a purifying gel for skin that stays fresh.",
    priceCents: 1799,
    categorySlug: "skincare",
    collectionSlugs: ["trending"],
    daysAgo: 27,
  },
  // Flash sale
  {
    name: "Gaming Console Controller",
    slug: "gaming-console-controller",
    description:
      "Hall-effect sticks, low-latency wireless and long battery life in one grip.",
    priceCents: 4999,
    compareAtPriceCents: 6999,
    categorySlug: "controllers",
    collectionSlugs: ["flash-sale"],
    daysAgo: 10,
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Big 360° sound, IPX7 waterproofing and 20 hours of playtime on the go.",
    priceCents: 5999,
    compareAtPriceCents: 7999,
    categorySlug: "computer-accessories",
    collectionSlugs: ["flash-sale"],
    daysAgo: 21,
  },
  {
    name: "Running Shoes Pro",
    slug: "running-shoes-pro",
    description:
      "Responsive foam, a breathable upper and a grippy outsole built for pace.",
    priceCents: 6999,
    compareAtPriceCents: 8999,
    categorySlug: "shoes",
    collectionSlugs: ["flash-sale"],
    daysAgo: 28,
  },
  {
    name: "256GB SSD",
    slug: "ssd-256gb",
    description:
      "3500MB/s reads that make boot and load times a thing of the past.",
    priceCents: 5999,
    compareAtPriceCents: 7499,
    categorySlug: "ssd",
    collectionSlugs: ["flash-sale", "trending"],
    daysAgo: 29,
  },
  {
    name: "VR Headset",
    slug: "vr-headset",
    description:
      "Inside-out tracking, a crisp display and wireless freedom in an all-in-one headset.",
    priceCents: 45999,
    compareAtPriceCents: 52999,
    featured: true,
    categorySlug: "vr",
    collectionSlugs: ["trending", "flash-sale"],
    daysAgo: 30,
  },
]

type BannerSeed = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  from: string
  to: string
}

const banners: BannerSeed[] = [
  {
    title: "Mega Electronics Week",
    subtitle: "Up to 40% off phones, laptops & more",
    ctaLabel: "Shop the sale",
    ctaHref: "/collections/flash-sale",
    from: "#4f46e5",
    to: "#7c3aed",
  },
  {
    title: "Fashion Fest",
    subtitle: "Fresh styles. Big drops. New season looks.",
    ctaLabel: "Explore fashion",
    ctaHref: "/categories/fashion",
    from: "#e11d48",
    to: "#f59e0b",
  },
  {
    title: "Gaming Corner",
    subtitle: "Level up your setup with our top picks",
    ctaLabel: "Browse gaming",
    ctaHref: "/categories/gaming",
    from: "#0f172a",
    to: "#1d4ed8",
  },
  {
    title: "Home Essentials Sale",
    subtitle: "Up to 30% off kitchen & decor",
    ctaLabel: "Shop home",
    ctaHref: "/categories/home-kitchen",
    from: "#0d9488",
    to: "#10b981",
  },
]

const palettes: [string, string][] = [
  ["#4f46e5", "#7c3aed"],
  ["#0d9488", "#10b981"],
  ["#0f172a", "#1e3a8a"],
  ["#7c3aed", "#db2777"],
  ["#b45309", "#d97706"],
  ["#be123c", "#f43f5e"],
  ["#1d4ed8", "#06b6d4"],
  ["#65a30d", "#84cc16"],
]

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function makeSvg(title: string, label: string, from: string, to: string) {
  const safeTitle = escapeXml(title)
  const safeLabel = escapeXml(label)
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

function makeBannerSvg(from: string, to: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="480" fill="url(#g)"/>
  <circle cx="1080" cy="90" r="180" fill="rgba(255,255,255,0.08)"/>
  <circle cx="980" cy="380" r="240" fill="rgba(255,255,255,0.06)"/>
  <rect x="56" y="56" width="1088" height="368" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
</svg>`
}

type VariantSeed = {
  title: string
  value: string
  priceCents?: number
  stock?: number
}

const reviewerPool = [
  {
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    comment: "Great value for the price — exactly as described.",
  },
  {
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    comment: "Quality feels premium. Shipping was fast too.",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    comment: "Very happy with this purchase. Would recommend.",
  },
  {
    name: "Rafiq Islam",
    email: "rafiq@example.com",
    comment: "Does the job well. Build quality is solid.",
  },
  {
    name: "Sadia Karim",
    email: "sadia@example.com",
    comment: "Looks great and works perfectly. Five stars.",
  },
  {
    name: "Imran Hossain",
    email: "imran@example.com",
    comment: "Decent product with good customer support.",
  },
]

function makeRichDescription(name: string, description: string) {
  return `<h2>Overview</h2><p>${escapeXml(description)}</p><ul><li>Genuine product with official warranty</li><li>Fast nationwide delivery</li><li>7-day easy returns</li></ul>`
}

function galleryFilesFor(
  slug: string,
  name: string,
  categorySlug: string,
  index: number
) {
  const [from, to] = palettes[index % palettes.length] ?? ["#334155", "#0f172a"]
  const label =
    flatCategories.find((category) => category.slug === categorySlug)?.name ??
    ""
  const files = [
    {
      path: `products/${slug}.svg`,
      svg: makeSvg(name.toUpperCase(), label.toUpperCase(), from, to),
    },
  ]
  for (let i = 1; i <= 2; i++) {
    const [f, t] = palettes[(index + i) % palettes.length] ?? [from, to]
    files.push({
      path: `products/${slug}/gallery-${i}.svg`,
      svg: makeSvg(
        name.toUpperCase(),
        `${label.toUpperCase()} · VIEW ${i + 1}`,
        f,
        t
      ),
    })
  }
  return files
}

function reviewsFor(index: number, baseDate: number) {
  const count = (index % 3) + 1
  const reviews = []
  for (let i = 0; i < count; i++) {
    const reviewer = reviewerPool[(index + i) % reviewerPool.length]
    const rating = [5, 4, 5, 3, 5, 4][(index + i) % 6]
    reviews.push({
      authorName: reviewer.name,
      authorEmail: reviewer.email,
      rating,
      comment: reviewer.comment,
      createdAt: baseDate - (count - 1 - i) * DAY,
    })
  }
  return reviews
}

// Legacy flat catalog replaced by the new taxonomy.
const legacyCategorySlugs = [
  "audio",
  "wearables",
  "laptops",
  "phones",
  "accessories",
]
const legacyProductSlugs = [
  "studio-wireless-headphones",
  "airpulse-earbuds-pro",
  "boombox-mini-speaker",
  "pulse-smartwatch-5",
  "fitband-activity-tracker",
  "ringfit-smart-ring",
  "slimbook-ultra-14",
  "titan-gaming-laptop-16",
  "vertex-x1-pro",
  "nova-lite-5g",
  "mechkey-75-keyboard",
  "powerdock-wireless-charger",
]

async function main() {
  console.log("Removing legacy flat catalog...")
  for (const slug of legacyProductSlugs) {
    const existing = await db.query({
      products: { $: { where: { slug } }, image: {} },
    })
    const product = existing.products[0]
    if (product) {
      await db.transact(db.tx.products[product.id].delete())
      if (product.image) {
        await db.transact(db.tx.$files[product.image.id].delete())
      }
      console.log(`  - removed product ${product.name}`)
    }
  }
  for (const slug of legacyCategorySlugs) {
    const existing = await db.query({
      categories: { $: { where: { slug } }, products: {} },
    })
    const category = existing.categories[0]
    if (!category) continue
    if (category.products?.length) {
      console.warn(`  ! keeping ${category.name} (still has products)`)
      continue
    }
    await db.transact(db.tx.categories[category.id].delete())
    console.log(`  - removed category ${category.name}`)
  }

  console.log("Seeding categories...")
  const categoriesQuery = await db.query({
    categories: { parent: {} },
  })
  const categoryIds = new Map<string, string>()
  const categoryParents = new Map<string, string>()
  for (const category of categoriesQuery.categories) {
    categoryIds.set(category.slug, category.id)
    if (category.parent?.slug) {
      categoryParents.set(category.slug, category.parent.slug)
    }
  }

  for (const category of flatCategories) {
    const existingId = categoryIds.get(category.slug)
    if (!existingId) {
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
    const parentSlug = category.parentSlug
    if (parentSlug) {
      const parentId = categoryIds.get(parentSlug)
      if (parentId && categoryParents.get(category.slug) !== parentSlug) {
        await db.transact(
          db.tx.categories[categoryIds.get(category.slug)!].link({
            parent: parentId,
          })
        )
        categoryParents.set(category.slug, parentSlug)
      }
    }
  }

  console.log("Seeding collections...")
  const collectionIds = new Map<string, string>()
  for (const collection of collections) {
    const existing = await db.query({
      collections: { $: { where: { slug: collection.slug } } },
    })
    if (existing.collections.length > 0) {
      collectionIds.set(collection.slug, existing.collections[0].id)
      console.log(`  - ${collection.name} (exists)`)
      continue
    }
    const collectionId = id()
    await db.transact(
      db.tx.collections[collectionId].create({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        sortOrder: collection.sortOrder,
      })
    )
    collectionIds.set(collection.slug, collectionId)
    console.log(`  + ${collection.name}`)
  }

  console.log("Seeding products...")
  const now = Date.now()
  let created = 0
  let skipped = 0

  for (const [index, product] of products.entries()) {
    const existing = await db.query({
      products: {
        $: { where: { slug: product.slug } },
        gallery: {},
        variants: {},
        reviews: {},
      },
    })
    const record = existing.products[0]
    const createdAt = now - product.daysAgo * DAY
    const reviews = reviewsFor(index, createdAt)
    const rating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length) *
              10
          ) / 10
        : 0
    const richDescription = makeRichDescription(
      product.name,
      product.description
    )
    const galleryFiles = galleryFilesFor(
      product.slug,
      product.name,
      product.categorySlug,
      index
    )

    if (record) {
      skipped += 1
      console.log(`  - ${product.name} (exists, syncing extras)`)

      await db.transact(
        db.tx.products[record.id].update({
          richDescription,
          rating,
          reviewCount: reviews.length,
          ...(product.stock != null ? { stock: product.stock } : {}),
        })
      )

      const existingPaths = new Set((record.gallery ?? []).map((f) => f.path))
      for (const galleryFile of galleryFiles.slice(1)) {
        if (existingPaths.has(galleryFile.path)) continue
        const { data: file } = await db.storage.uploadFile(
          galleryFile.path,
          Buffer.from(galleryFile.svg),
          { contentType: "image/svg+xml" }
        )
        await db.transact(db.tx.products[record.id].link({ gallery: file.id }))
      }

      for (const variant of record.variants ?? []) {
        await db.transact(db.tx.productVariants[variant.id].delete())
      }
      for (const variant of product.variants ?? []) {
        const variantId = id()
        await db.transact(
          db.tx.productVariants[variantId]
            .create({
              title: variant.title,
              value: variant.value,
              priceCents: variant.priceCents,
              stock: variant.stock,
            })
            .link({ product: record.id })
        )
      }

      for (const review of record.reviews ?? []) {
        await db.transact(db.tx.reviews[review.id].delete())
      }
      for (const review of reviews) {
        const reviewId = id()
        await db.transact(
          db.tx.reviews[reviewId]
            .create({
              authorName: review.authorName,
              authorEmail: review.authorEmail,
              rating: review.rating,
              comment: review.comment,
              createdAt: review.createdAt,
            })
            .link({ product: record.id })
        )
      }
      continue
    }

    const categoryId = categoryIds.get(product.categorySlug)
    if (!categoryId) {
      console.warn(
        `  ! Skipping ${product.name}: unknown category ${product.categorySlug}`
      )
      continue
    }

    const thumbnail = galleryFiles[0]
    const { data: file } = await db.storage.uploadFile(
      thumbnail.path,
      Buffer.from(thumbnail.svg),
      { contentType: "image/svg+xml" }
    )

    const galleryFileIds: string[] = []
    for (const galleryFile of galleryFiles.slice(1)) {
      const { data: galleryFileData } = await db.storage.uploadFile(
        galleryFile.path,
        Buffer.from(galleryFile.svg),
        { contentType: "image/svg+xml" }
      )
      galleryFileIds.push(galleryFileData.id)
    }

    const productId = id()
    const collectionIdsToLink = product.collectionSlugs
      .map((slug) => collectionIds.get(slug))
      .filter((slug): slug is string => Boolean(slug))

    const chunk = db.tx.products[productId]
      .create({
        name: product.name,
        slug: product.slug,
        description: product.description,
        richDescription,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        featured: product.featured ?? false,
        inStock: product.inStock ?? true,
        ...(product.stock != null ? { stock: product.stock } : {}),
        rating,
        reviewCount: reviews.length,
        createdAt,
      })
      .link({
        image: file.id,
        category: categoryId,
        collections: collectionIdsToLink,
      })
    if (galleryFileIds.length > 0) {
      chunk.link({ gallery: galleryFileIds })
    }
    await db.transact(chunk)

    for (const variant of product.variants ?? []) {
      const variantId = id()
      await db.transact(
        db.tx.productVariants[variantId]
          .create({
            title: variant.title,
            value: variant.value,
            priceCents: variant.priceCents,
            stock: variant.stock,
          })
          .link({ product: productId })
      )
    }

    for (const review of reviews) {
      const reviewId = id()
      await db.transact(
        db.tx.reviews[reviewId]
          .create({
            authorName: review.authorName,
            authorEmail: review.authorEmail,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
          })
          .link({ product: productId })
      )
    }

    created += 1
    console.log(`  + ${product.name}`)
  }

  console.log("Seeding banners...")
  const bannerCount = (await db.query({ banners: {} })).banners.length
  if (bannerCount > 0) {
    console.log(`  - ${bannerCount} banner(s) already exist, skipping`)
  } else {
    for (const [index, banner] of banners.entries()) {
      const svg = makeBannerSvg(banner.from, banner.to)
      const filePath = `banners/${index}.svg`
      const { data: file } = await db.storage.uploadFile(
        filePath,
        Buffer.from(svg),
        { contentType: "image/svg+xml" }
      )
      const bannerId = id()
      await db.transact(
        db.tx.banners[bannerId]
          .create({
            title: banner.title,
            subtitle: banner.subtitle,
            ctaLabel: banner.ctaLabel,
            ctaHref: banner.ctaHref,
          })
          .link({ image: file.id })
      )
      console.log(`  + ${banner.title}`)
    }
  }

  console.log("Seeding coupons...")
  for (const coupon of coupons) {
    const existing = await db.query({
      coupons: { $: { where: { code: coupon.code } } },
    })
    if (existing.coupons.length > 0) {
      console.log(`  - ${coupon.code} (exists)`)
      continue
    }
    const couponId = id()
    await db.transact(
      db.tx.coupons[couponId].create({
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        minSubtotalCents: coupon.minSubtotalCents,
        maxDiscountCents: coupon.maxDiscountCents,
        active: coupon.active ?? true,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        usageLimit: coupon.usageLimit,
        createdAt: Date.now(),
      })
    )
    console.log(`  + ${coupon.code}`)
  }

  console.log(
    `\nDone. Created ${created} products, skipped ${skipped}. Categories: ${flatCategories.length}, Collections: ${collections.length}.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
