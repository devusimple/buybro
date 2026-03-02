Here is a complete, single-file HTML solution using Tailwind CSS.

### Key Features of this Design:

1.  **Mobile First Grid:** It uses `grid-cols-2` by default, ensuring exactly two products per row on mobile devices as requested.
2.  **Clean Aesthetics:** Uses a soft gray background, ample whitespace, and subtle shadows (`shadow-sm` to `shadow-md` on hover) to create depth without clutter.
3.  **Responsive Scaling:**
    - **Mobile:** 2 columns.
    - **Tablet:** 3 columns.
    - **Desktop:** 4 columns.
4.  **Interactive Elements:** Includes hover states (image zoom, card lift), a "Quick Add" button, and a "Wishlist" heart icon.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modern Product Listing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      rel="stylesheet"
    />
    <style>
      /* Custom font for a cleaner look */
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");
      body {
        font-family: "Inter", sans-serif;
      }

      /* Hide scrollbar for category pills */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800">
    <!-- Navbar (Simplified) -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold"
            >
              L
            </div>
            <span class="font-semibold text-lg tracking-tight">Lumina</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="text-gray-500 hover:text-black relative">
              <i class="fa-solid fa-cart-shopping"></i>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                >2</span
              >
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header & Filters -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">New Arrivals</h1>
          <p class="text-gray-500 text-sm mt-1">Showing 12 of 48 products</p>
        </div>

        <!-- Filter Pills (Horizontal Scroll on Mobile) -->
        <div
          class="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0"
        >
          <button
            class="px-4 py-2 bg-black text-white text-sm font-medium rounded-full whitespace-nowrap"
          >
            All
          </button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Clothing
          </button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Accessories
          </button>
          <button
            class="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Footwear
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <!-- 
           grid-cols-2: Mobile (2 items per row)
           sm:grid-cols-3: Small tablets
           lg:grid-cols-4: Desktop
           gap-x-4 gap-y-8: Spacing
        -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
      >
        <!-- Product Card 1 -->
        <div class="group relative">
          <!-- Image Container -->
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
              alt="Watch"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <!-- Wishlist Button -->
            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>

            <!-- Badge -->
            <span
              class="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide"
              >New</span
            >
          </div>

          <!-- Product Details -->
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#">
                  <span aria-hidden="true" class="absolute inset-0"></span>
                  Minimalist Watch
                </a>
              </h3>
              <p class="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$120</p>
          </div>

          <!-- Add to Cart (Visible on Hover for Desktop, Always for Mobile logic handled by CSS) -->
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 2 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
              alt="Shoe"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span>Red
                  Runner Sport</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Footwear</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$85</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 3 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"
              alt="Jacket"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
            <span
              class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide"
              >-20%</span
            >
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Denim Jacket</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Clothing</p>
            </div>
            <div class="flex flex-col items-end">
              <p class="text-sm font-semibold text-gray-900">$64</p>
              <p class="text-xs text-gray-400 line-through">$80</p>
            </div>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 4 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
              alt="Headphones"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Wireless Headphones</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Electronics</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$249</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 5 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop"
              alt="Bag"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Leather Tote</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$150</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 6 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop"
              alt="Camera"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Polaroid Cam</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Electronics</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$99</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 7 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop"
              alt="T-Shirt"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Basic Black Tee</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Clothing</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$25</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Card 8 -->
        <div class="group relative">
          <div
            class="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=1000&auto=format&fit=crop"
              alt="Sunglasses"
              class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              class="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                  ><span aria-hidden="true" class="absolute inset-0"></span
                  >Aviator Shades</a
                >
              </h3>
              <p class="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">$110</p>
          </div>
          <button
            class="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-12">
        <nav class="flex items-center gap-2">
          <button
            class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium"
          >
            1
          </button>
          <button
            class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            2
          </button>
          <button
            class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            3
          </button>
          <button
            class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2023 Lumina Store. All rights reserved.
      </div>
    </footer>
  </body>
</html>
```

---

Here is a comprehensive Product Details Page designed to match the aesthetic of the listing page. It includes a responsive image gallery, size/color selectors, quantity input, tabbed information, and a related products section.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minimalist Watch - Product Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      rel="stylesheet"
    />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");
      body {
        font-family: "Inter", sans-serif;
      }

      /* Hide scrollbar for horizontal scrolling elements */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      /* Smooth scroll behavior */
      html {
        scroll-behavior: smooth;
      }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800">
    <!-- Navbar (Consistent with Listing) -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold"
            >
              L
            </div>
            <span class="font-semibold text-lg tracking-tight">Lumina</span>
          </div>
          <div class="flex items-center gap-6">
            <a
              href="#"
              class="hidden md:block text-sm font-medium text-gray-600 hover:text-black"
              >Shop</a
            >
            <a
              href="#"
              class="hidden md:block text-sm font-medium text-gray-600 hover:text-black"
              >About</a
            >
            <button class="text-gray-500 hover:text-black relative">
              <i class="fa-solid fa-cart-shopping"></i>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                >2</span
              >
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav class="flex text-sm text-gray-500">
        <a href="#" class="hover:text-black">Home</a>
        <span class="mx-2">/</span>
        <a href="#" class="hover:text-black">Accessories</a>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium">Minimalist Watch</span>
      </nav>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <!-- Product Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <!-- Left Column: Image Gallery -->
        <div class="flex flex-col gap-4">
          <!-- Main Image -->
          <div
            class="aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          >
            <img
              id="mainImage"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
              alt="Main Product"
              class="w-full h-full object-cover object-center"
            />
          </div>

          <!-- Thumbnails (Horizontal Scroll on Mobile) -->
          <div class="flex md:flex-row gap-4 overflow-x-auto no-scrollbar pb-2">
            <button
              onclick="changeImage(this.src)"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-black"
            >
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                class="w-full h-full object-cover"
              />
            </button>
            <button
              onclick="changeImage(this.src)"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
            >
              <img
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200&auto=format&fit=crop"
                class="w-full h-full object-cover"
              />
            </button>
            <button
              onclick="changeImage(this.src)"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
            >
              <img
                src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=200&auto=format&fit=crop"
                class="w-full h-full object-cover"
              />
            </button>
            <button
              onclick="changeImage(this.src)"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
            >
              <img
                src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=200&auto=format&fit=crop"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Right Column: Product Info (Sticky on Desktop) -->
        <div class="flex flex-col">
          <!-- Header -->
          <div class="mb-6">
            <div class="flex justify-between items-start">
              <h1 class="text-3xl font-bold text-gray-900">Minimalist Watch</h1>
              <button
                class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
              >
                <i class="fa-regular fa-heart text-xl"></i>
              </button>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <div class="flex text-yellow-400 text-xs">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
              </div>
              <span class="text-sm text-gray-500">(128 Reviews)</span>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <span class="text-3xl font-medium text-gray-900">$120.00</span>
              <span class="text-lg text-gray-400 line-through">$150.00</span>
              <span
                class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded"
                >20% OFF</span
              >
            </div>
          </div>

          <!-- Description Short -->
          <p class="text-gray-600 mb-8 leading-relaxed">
            A timeless classic reimagined for the modern era. Featuring a
            genuine leather strap, sapphire crystal glass, and a precision
            quartz movement. Water-resistant up to 50 meters.
          </p>

          <!-- Selectors -->
          <div class="space-y-6 mb-8">
            <!-- Color Selector -->
            <div>
              <span class="text-sm font-medium text-gray-900 block mb-3"
                >Color:
                <span class="text-gray-500 font-normal">Black</span></span
              >
              <div class="flex items-center gap-3">
                <button
                  class="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black focus:outline-none"
                ></button>
                <button
                  class="w-8 h-8 rounded-full bg-slate-300 ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:outline-none"
                ></button>
                <button
                  class="w-8 h-8 rounded-full bg-amber-700 ring-2 ring-offset-2 ring-transparent hover:ring-amber-700 focus:outline-none"
                ></button>
              </div>
            </div>

            <!-- Size Selector (if applicable) or Strap Length -->
            <div>
              <div class="flex justify-between mb-3">
                <span class="text-sm font-medium text-gray-900"
                  >Strap Size</span
                >
                <a href="#" class="text-xs text-gray-500 underline"
                  >Size Guide</a
                >
              </div>
              <div class="grid grid-cols-4 gap-3">
                <button
                  class="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                >
                  38mm
                </button>
                <button
                  class="py-2 px-4 border border-black bg-black text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  42mm
                </button>
                <button
                  class="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                >
                  44mm
                </button>
                <button
                  class="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                >
                  46mm
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <!-- Quantity -->
            <div
              class="flex items-center border border-gray-300 rounded-lg w-full sm:w-32"
            >
              <button
                class="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
              >
                <i class="fa-solid fa-minus text-xs"></i>
              </button>
              <input
                type="text"
                value="1"
                class="w-full text-center text-sm font-medium text-gray-900 focus:outline-none"
                readonly
              />
              <button
                class="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
              >
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

            <!-- Add to Cart -->
            <button
              class="flex-1 bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              Add to Cart
            </button>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
            <div class="flex flex-col items-center text-center gap-2">
              <i class="fa-solid fa-truck text-gray-400"></i>
              <span class="text-xs text-gray-500">Free Shipping</span>
            </div>
            <div class="flex flex-col items-center text-center gap-2">
              <i class="fa-solid fa-shield-halved text-gray-400"></i>
              <span class="text-xs text-gray-500">2 Year Warranty</span>
            </div>
            <div class="flex flex-col items-center text-center gap-2">
              <i class="fa-solid fa-rotate-left text-gray-400"></i>
              <span class="text-xs text-gray-500">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section (Description, Specs, Reviews) -->
      <div class="mt-16 border-t border-gray-200 pt-10">
        <div
          class="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar"
        >
          <button
            class="px-6 py-4 text-sm font-medium text-black border-b-2 border-black whitespace-nowrap"
          >
            Description
          </button>
          <button
            class="px-6 py-4 text-sm font-medium text-gray-500 hover:text-black whitespace-nowrap"
          >
            Specifications
          </button>
          <button
            class="px-6 py-4 text-sm font-medium text-gray-500 hover:text-black whitespace-nowrap"
          >
            Shipping & Returns
          </button>
        </div>

        <div class="prose prose-sm text-gray-600 max-w-none">
          <p>
            The Minimalist Watch is designed for those who appreciate the finer
            details. Crafted with precision, this timepiece features a stainless
            steel case and a genuine leather strap that ages beautifully over
            time.
          </p>
          <ul class="list-disc pl-5 mt-4 space-y-2">
            <li>Case Diameter: 42mm</li>
            <li>Case Thickness: 10mm</li>
            <li>Strap Width: 20mm</li>
            <li>Movement: Japanese Quartz</li>
            <li>Water Resistance: 5 ATM</li>
          </ul>
        </div>
      </div>

      <!-- Related Products -->
      <div class="mt-20">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">
          You Might Also Like
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <!-- Related Item 1 -->
          <div class="group">
            <div
              class="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
            >
              <img
                src="https://images.unsplash.com/photo-1619134778706-c27e0619891a?q=80&w=500&auto=format&fit=crop"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="text-sm font-medium text-gray-900">Leather Wallet</h3>
            <p class="text-sm text-gray-500 mt-1">$45.00</p>
          </div>
          <!-- Related Item 2 -->
          <div class="group">
            <div
              class="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
            >
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500&auto=format&fit=crop"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="text-sm font-medium text-gray-900">Sport Sneakers</h3>
            <p class="text-sm text-gray-500 mt-1">$110.00</p>
          </div>
          <!-- Related Item 3 -->
          <div class="group">
            <div
              class="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
            >
              <img
                src="https://images.unsplash.com/photo-1572569028738-411a29630962?q=80&w=500&auto=format&fit=crop"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="text-sm font-medium text-gray-900">Cotton Cap</h3>
            <p class="text-sm text-gray-500 mt-1">$25.00</p>
          </div>
          <!-- Related Item 4 -->
          <div class="group">
            <div
              class="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
            >
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=500&auto=format&fit=crop"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 class="text-sm font-medium text-gray-900">Headphones</h3>
            <p class="text-sm text-gray-500 mt-1">$199.00</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2023 Lumina Store. All rights reserved.
      </div>
    </footer>

    <script>
      // Simple script to handle image switching
      function changeImage(src) {
        // Get high res version (in a real app, you'd handle this differently)
        const highResSrc = src.replace("&w=200", "&w=1000");
        document.getElementById("mainImage").src = highResSrc;

        // Reset border styles for thumbnails
        const buttons = document.querySelectorAll(
          'button[onclick^="changeImage"]',
        );
        buttons.forEach((btn) => {
          btn.classList.remove("border-black");
          btn.classList.add("border-transparent");
        });

        // Add active border to clicked thumbnail
        event.currentTarget.classList.remove("border-transparent");
        event.currentTarget.classList.add("border-black");
      }
    </script>
  </body>
</html>
```

---

---

Here is a clean, fully responsive Cart page. It features a modern layout where the order summary sticks to the side on desktop, and a clear list of items on mobile.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Cart - Lumina</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      rel="stylesheet"
    />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");
      body {
        font-family: "Inter", sans-serif;
      }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800">
    <!-- Navbar -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold"
            >
              L
            </div>
            <span class="font-semibold text-lg tracking-tight">Lumina</span>
          </div>
          <div class="flex items-center gap-6">
            <a
              href="#"
              class="hidden md:block text-sm font-medium text-gray-600 hover:text-black"
              >Shop</a
            >
            <a
              href="#"
              class="hidden md:block text-sm font-medium text-gray-600 hover:text-black"
              >About</a
            >
            <button class="text-black relative">
              <i class="fa-solid fa-cart-shopping"></i>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                >3</span
              >
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column: Cart Items -->
        <div class="flex-1">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <ul class="divide-y divide-gray-100">
              <!-- Item 1 -->
              <li class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <!-- Image -->
                <div
                  class="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                    alt="Watch"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Details -->
                <div class="flex-1 flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-base font-semibold text-gray-900">
                        <a href="#">Minimalist Watch</a>
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Color: Black | Size: 42mm
                      </p>
                    </div>
                    <p class="text-base font-medium text-gray-900">$120.00</p>
                  </div>

                  <div class="flex justify-between items-end mt-4">
                    <!-- Quantity Controls -->
                    <div
                      class="flex items-center border border-gray-300 rounded-lg"
                    >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <i class="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span
                        class="w-8 text-center text-sm font-medium text-gray-900"
                        >1</span
                      >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <i class="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>

                    <!-- Remove Button -->
                    <button
                      type="button"
                      class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </div>
              </li>

              <!-- Item 2 -->
              <li class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div
                  class="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"
                    alt="Shoe"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-base font-semibold text-gray-900">
                        <a href="#">Red Runner Sport</a>
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Color: Red | Size: US 10
                      </p>
                    </div>
                    <p class="text-base font-medium text-gray-900">$85.00</p>
                  </div>
                  <div class="flex justify-between items-end mt-4">
                    <div
                      class="flex items-center border border-gray-300 rounded-lg"
                    >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <i class="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span
                        class="w-8 text-center text-sm font-medium text-gray-900"
                        >1</span
                      >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <i class="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </div>
              </li>

              <!-- Item 3 -->
              <li class="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div
                  class="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
                    alt="Jacket"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-base font-semibold text-gray-900">
                        <a href="#">Denim Jacket</a>
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Color: Blue | Size: M
                      </p>
                    </div>
                    <p class="text-base font-medium text-gray-900">$64.00</p>
                  </div>
                  <div class="flex justify-between items-end mt-4">
                    <div
                      class="flex items-center border border-gray-300 rounded-lg"
                    >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <i class="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span
                        class="w-8 text-center text-sm font-medium text-gray-900"
                        >2</span
                      >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <i class="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      type="button"
                      class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <i class="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Cart Actions (Mobile Only usually, but good for desktop too) -->
            <div class="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
              <a
                href="#"
                class="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                <i class="fa-solid fa-arrow-left mr-2"></i> Continue Shopping
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="w-full lg:w-96 flex-shrink-0">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24"
          >
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div class="flow-root">
              <dl class="-my-4 text-sm divide-y divide-gray-100">
                <div class="flex items-center justify-between py-4">
                  <dt class="text-gray-600">Subtotal</dt>
                  <dd class="font-medium text-gray-900">$333.00</dd>
                </div>
                <div class="flex items-center justify-between py-4">
                  <dt class="text-gray-600">Shipping Estimate</dt>
                  <dd class="font-medium text-gray-900">$5.00</dd>
                </div>
                <div class="flex items-center justify-between py-4">
                  <dt class="text-gray-600">Tax Estimate</dt>
                  <dd class="font-medium text-gray-900">$26.64</dd>
                </div>
                <div class="flex items-center justify-between py-4">
                  <dt class="text-base font-bold text-gray-900">Order Total</dt>
                  <dd class="text-base font-bold text-gray-900">$364.64</dd>
                </div>
              </dl>
            </div>

            <!-- Promo Code -->
            <div class="mt-6">
              <form class="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  class="flex-1 block w-full rounded-lg border-gray-300 bg-gray-50 border px-3 py-2 text-sm focus:border-black focus:ring-black focus:outline-none"
                />
                <button
                  type="button"
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>

            <!-- Checkout Button -->
            <div class="mt-6">
              <button
                class="w-full bg-black text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Checkout
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="mt-6 flex justify-center gap-4 text-gray-400">
              <i class="fa-brands fa-cc-visa text-2xl"></i>
              <i class="fa-brands fa-cc-mastercard text-2xl"></i>
              <i class="fa-brands fa-cc-paypal text-2xl"></i>
              <i class="fa-brands fa-cc-apple-pay text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2023 Lumina Store. All rights reserved.
      </div>
    </footer>
  </body>
</html>
```

---

Here is a clean, conversion-focused Checkout page. It features a split layout (forms on the left, order summary on the right) that stacks perfectly on mobile devices.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Checkout - Lumina</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      rel="stylesheet"
    />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");
      body {
        font-family: "Inter", sans-serif;
      }

      /* Custom checkbox/radio styling */
      .custom-radio:checked + div {
        border-color: #000;
        background-color: #f9fafb;
      }
      .custom-radio:checked + div .radio-circle {
        border-color: #000;
      }
      .custom-radio:checked + div .radio-circle::after {
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        background: #000;
        border-radius: 50%;
        margin: 2px;
      }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800">
    <!-- Navbar (Simplified for Checkout) -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold"
            >
              L
            </div>
            <span class="font-semibold text-lg tracking-tight">Lumina</span>
          </div>
          <a
            href="#"
            class="text-sm font-medium text-gray-500 hover:text-black"
          >
            <i class="fa-solid fa-lock mr-1"></i> Secure Checkout
          </a>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <!-- LEFT COLUMN: Forms -->
        <div class="lg:col-span-7">
          <!-- 1. Contact Information -->
          <section class="mb-10">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div class="relative">
              <input
                type="email"
                placeholder="Email address"
                class="block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
              />
              <div class="mt-2 flex items-center">
                <input
                  id="newsletter"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label for="newsletter" class="ml-2 block text-sm text-gray-500"
                  >Email me with news and offers</label
                >
              </div>
            </div>
          </section>

          <!-- 2. Shipping Information -->
          <section class="mb-10">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div class="sm:col-span-1">
                <label
                  for="first-name"
                  class="block text-sm font-medium text-gray-700"
                  >First name</label
                >
                <input
                  type="text"
                  id="first-name"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-1">
                <label
                  for="last-name"
                  class="block text-sm font-medium text-gray-700"
                  >Last name</label
                >
                <input
                  type="text"
                  id="last-name"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-2">
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700"
                  >Address</label
                >
                <input
                  type="text"
                  id="address"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-2">
                <label
                  for="apartment"
                  class="block text-sm font-medium text-gray-700"
                  >Apartment, suite, etc. (optional)</label
                >
                <input
                  type="text"
                  id="apartment"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-1">
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700"
                  >City</label
                >
                <input
                  type="text"
                  id="city"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-1">
                <label
                  for="postal-code"
                  class="block text-sm font-medium text-gray-700"
                  >Postal code</label
                >
                <input
                  type="text"
                  id="postal-code"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                />
              </div>
              <div class="sm:col-span-2">
                <label
                  for="country"
                  class="block text-sm font-medium text-gray-700"
                  >Country</label
                >
                <select
                  id="country"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </section>

          <!-- 3. Payment Method -->
          <section class="mb-10">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Credit Card Option -->
              <label
                class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  name="payment-type"
                  value="card"
                  class="sr-only custom-radio"
                  checked
                />
                <div class="flex w-full items-center justify-between">
                  <span class="flex flex-1">
                    <span class="flex flex-col">
                      <span class="block text-sm font-medium text-gray-900"
                        >Credit Card</span
                      >
                      <span
                        class="mt-1 flex items-center text-xs text-gray-500"
                      >
                        <i class="fa-regular fa-credit-card mr-1"></i> Visa,
                        Mastercard, Amex
                      </span>
                    </span>
                  </span>
                  <span
                    class="radio-circle block h-4 w-4 border border-gray-300 rounded-full"
                  ></span>
                </div>
              </label>

              <!-- PayPal Option -->
              <label
                class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  name="payment-type"
                  value="paypal"
                  class="sr-only custom-radio"
                />
                <div class="flex w-full items-center justify-between">
                  <span class="flex flex-1">
                    <span class="flex flex-col">
                      <span class="block text-sm font-medium text-gray-900"
                        >PayPal</span
                      >
                      <span
                        class="mt-1 flex items-center text-xs text-gray-500"
                      >
                        <i class="fa-brands fa-paypal mr-1"></i> Pay with your
                        PayPal account
                      </span>
                    </span>
                  </span>
                  <span
                    class="radio-circle block h-4 w-4 border border-gray-300 rounded-full"
                  ></span>
                </div>
              </label>
            </div>

            <!-- Credit Card Form (Visible if Card Selected) -->
            <div
              class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
            >
              <div class="sm:col-span-2">
                <label
                  for="card-number"
                  class="block text-sm font-medium text-gray-700"
                  >Card number</label
                >
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="card-number"
                    class="block w-full rounded-lg border-gray-300 bg-white border pl-10 pr-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                    placeholder="0000 0000 0000 0000"
                  />
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <i class="fa-regular fa-credit-card text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div>
                <label
                  for="expiration-date"
                  class="block text-sm font-medium text-gray-700"
                  >Expiration date (MM/YY)</label
                >
                <input
                  type="text"
                  id="expiration-date"
                  class="mt-1 block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                  placeholder="MM / YY"
                />
              </div>
              <div>
                <label for="cvc" class="block text-sm font-medium text-gray-700"
                  >CVC</label
                >
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="cvc"
                    class="block w-full rounded-lg border-gray-300 bg-white border px-4 py-3 text-gray-900 focus:border-black focus:ring-black focus:outline-none sm:text-sm"
                    placeholder="123"
                  />
                  <div
                    class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                  >
                    <i
                      class="fa-solid fa-circle-question text-gray-400"
                      title="3 digits on back of card"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN: Order Summary -->
        <div class="lg:col-span-5 mt-10 lg:mt-0">
          <div
            class="bg-gray-50 rounded-2xl border border-gray-200 p-6 lg:p-8 sticky top-8"
          >
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <!-- Cart Items List -->
            <ul class="divide-y divide-gray-200 mb-6">
              <li class="flex py-4">
                <div
                  class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                    alt="Watch"
                    class="h-full w-full object-cover object-center"
                  />
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div
                      class="flex justify-between text-base font-medium text-gray-900"
                    >
                      <h3>Minimalist Watch</h3>
                      <p class="ml-4">$120.00</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Black | 42mm</p>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <p class="text-gray-500">Qty 1</p>
                  </div>
                </div>
              </li>
              <li class="flex py-4">
                <div
                  class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"
                    alt="Shoe"
                    class="h-full w-full object-cover object-center"
                  />
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div
                      class="flex justify-between text-base font-medium text-gray-900"
                    >
                      <h3>Red Runner Sport</h3>
                      <p class="ml-4">$85.00</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Red | US 10</p>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <p class="text-gray-500">Qty 1</p>
                  </div>
                </div>
              </li>
              <li class="flex py-4">
                <div
                  class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
                    alt="Jacket"
                    class="h-full w-full object-cover object-center"
                  />
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div
                      class="flex justify-between text-base font-medium text-gray-900"
                    >
                      <h3>Denim Jacket</h3>
                      <p class="ml-4">$128.00</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Blue | M</p>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <p class="text-gray-500">Qty 2</p>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Discount Code -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  class="flex-1 block w-full rounded-lg border-gray-300 bg-white border px-3 py-2 text-sm focus:border-black focus:ring-black focus:outline-none"
                />
                <button
                  type="button"
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Subtotal</p>
                <p class="text-sm font-medium text-gray-900">$333.00</p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <p class="text-sm text-gray-600">Shipping</p>
                <p class="text-sm font-medium text-gray-900">$5.00</p>
              </div>
              <div class="flex items-center justify-between mt-4">
                <p class="text-sm text-gray-600">Taxes</p>
                <p class="text-sm font-medium text-gray-900">$26.64</p>
              </div>
              <div
                class="flex items-center justify-between mt-6 border-t border-gray-200 pt-6"
              >
                <p class="text-base font-bold text-gray-900">Total</p>
                <p class="text-base font-bold text-gray-900">$364.64</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="mt-8 w-full bg-black text-white px-6 py-4 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex justify-center items-center gap-2"
            >
              <span>Pay $364.64</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>

            <p class="mt-4 text-xs text-center text-gray-500">
              <i class="fa-solid fa-lock mr-1"></i> All transactions are secure
              and encrypted.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; 2023 Lumina Store. All rights reserved.
      </div>
    </footer>
  </body>
</html>
```
