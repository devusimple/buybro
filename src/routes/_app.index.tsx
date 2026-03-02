import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <!-- Header & Filters --> */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Arrivals</h1>
          <p className="text-gray-500 text-sm mt-1">Showing 12 of 48 products</p>
        </div>

        {/* <!-- Filter Pills (Horizontal Scroll on Mobile) --> */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0"
        >
          <button
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full whitespace-nowrap"
          >
            All
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Clothing
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Accessories
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black text-sm font-medium rounded-full whitespace-nowrap transition-colors"
          >
            Footwear
          </button>
        </div>
      </div>

      {/* <!-- Product Grid --> */}
      {/* <!-- 
           grid-cols-2: Mobile (2 items per row)
           sm:grid-cols-3: Small tablets
           lg:grid-cols-4: Desktop
           gap-x-4 gap-y-8: Spacing
        --> */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
      >
        {/* <!-- Product Card 1 --> */}
        <Link to={'/products/1'} className='group relative'>
          {/* <!-- Image Container --> */}
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
              alt="Watch"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            {/* <!-- Wishlist Button --> */}
            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <Heart size={18} />
            </button>

            {/* <!-- Badge --> */}
            <span
              className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide"
            >New</span
            >
          </div>

          {/* <!-- Product Details --> */}
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#">
                  <span aria-hidden="true" className="absolute inset-0"></span>
                  Minimalist Watch
                </a>
              </h3>
              <p className="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$120</p>
          </div>

          {/* <!-- Add to Cart (Visible on Hover for Desktop, Always for Mobile logic handled by CSS) --> */}
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-100 group-hover:opacity-100 transition-opacity md:block"
          >
            Add to Cart
          </button>
        </Link>

        {/* <!-- Product Card 2 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
              alt="Shoe"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span>Red
                  Runner Sport</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Footwear</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$85</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-100 group-hover:opacity-100 transition-opacity md:block"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 3 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"
              alt="Jacket"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
            <span
              className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide"
            >-20%</span
            >
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Denim Jacket</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Clothing</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-gray-900">$64</p>
              <p className="text-xs text-gray-400 line-through">$80</p>
            </div>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-100 group-hover:opacity-100 transition-opacity md:block"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 4 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
              alt="Headphones"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Wireless Headphones</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Electronics</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$249</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 5 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop"
              alt="Bag"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Leather Tote</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$150</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 6 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop"
              alt="Camera"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Polaroid Cam</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Electronics</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$99</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 7 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop"
              alt="T-Shirt"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Basic Black Tee</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Clothing</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$25</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>

        {/* <!-- Product Card 8 --> */}
        <div className="group relative">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=1000&auto=format&fit=crop"
              alt="Sunglasses"
              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-700 font-medium truncate pr-2">
                <a href="#"
                ><span aria-hidden="true" className="absolute inset-0"></span
                >Aviator Shades</a
                >
              </h3>
              <p className="mt-1 text-xs text-gray-500">Accessories</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">$110</p>
          </div>
          <button
            className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* <!-- Pagination --> */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium"
          >
            1
          </button>
          <button
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            2
          </button>
          <button
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            3
          </button>
          <button
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </main>
  )
}
