import type schema from '@/instant.schema'
import db from '@/lib/db'
import type { InstaQLEntity } from '@instantdb/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type Product = InstaQLEntity<typeof schema, "products", {}, undefined, true>


export const Route = createFileRoute('/products/$id')({
    component: RouteComponent,
})


function RouteComponent() {
    const { id } = Route.useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        (async () => {
            const result = await db.queryOnce({
                products: {
                    $: {
                        where: { id: id }
                    },
                    variants: {},
                    category: {},
                }
            });
            setProduct(result.data.products[0]);
        })();
    }, [id]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* <!-- Product Section --> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* <!-- Left Column: Image Gallery --> */}
                <div className="flex flex-col gap-4">
                    {/* <!-- Main Image --> */}
                    <div
                        className="aspect-square w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                    >
                        <img
                            id="mainImage"
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                            alt="Main Product"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* <!-- Thumbnails (Horizontal Scroll on Mobile) --> */}
                    <div className="flex md:flex-row gap-4 overflow-x-auto no-scrollbar pb-2">
                        <button
                            className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-black"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                            />
                        </button>
                        <button
                            className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                            />
                        </button>
                        <button
                            className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=200&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                            />
                        </button>
                        <button
                            className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=200&auto=format&fit=crop"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </div>

                {/* <!-- Right Column: Product Info (Sticky on Desktop) --> */}
                <div className="flex flex-col">
                    {/* <!-- Header --> */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-900">Minimalist Watch</h1>
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <i className="fa-regular fa-heart text-xl"></i>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-yellow-400 text-xs">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <span className="text-sm text-gray-500">(128 Reviews)</span>
                        </div>
                    </div>

                    {/* <!-- Price --> */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-medium text-gray-900">$120.00</span>
                            <span className="text-lg text-gray-400 line-through">$150.00</span>
                            <span
                                className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded"
                            >20% OFF</span
                            >
                        </div>
                    </div>

                    {/* <!-- Description Short --> */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        A timeless classNameic reimagined for the modern era. Featuring a
                        genuine leather strap, sapphire crystal glass, and a precision
                        quartz movement. Water-resistant up to 50 meters.
                    </p>

                    {/* <!-- Selectors --> */}
                    <div className="space-y-6 mb-8">
                        {/* <!-- Color Selector --> */}
                        <div>
                            <span className="text-sm font-medium text-gray-900 block mb-3"
                            >Color:
                                <span className="text-gray-500 font-normal">Black</span></span
                            >
                            <div className="flex items-center gap-3">
                                <button
                                    className="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black focus:outline-none"
                                ></button>
                                <button
                                    className="w-8 h-8 rounded-full bg-slate-300 ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:outline-none"
                                ></button>
                                <button
                                    className="w-8 h-8 rounded-full bg-amber-700 ring-2 ring-offset-2 ring-transparent hover:ring-amber-700 focus:outline-none"
                                ></button>
                            </div>
                        </div>

                        {/* <!-- Size Selector (if applicable) or Strap Length --> */}
                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-sm font-medium text-gray-900"
                                >Strap Size</span
                                >
                                <a href="#" className="text-xs text-gray-500 underline"
                                >Size Guide</a
                                >
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    className="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                                >
                                    38mm
                                </button>
                                <button
                                    className="py-2 px-4 border border-black bg-black text-white rounded-lg text-sm font-medium shadow-sm"
                                >
                                    42mm
                                </button>
                                <button
                                    className="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                                >
                                    44mm
                                </button>
                                <button
                                    className="py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-black hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-1"
                                >
                                    46mm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Actions --> */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* <!-- Quantity --> */}
                        <div
                            className="flex items-center border border-gray-300 rounded-lg w-full sm:w-32"
                        >
                            <button
                                className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                            >
                                <i className="fa-solid fa-minus text-xs"></i>
                            </button>
                            <input
                                type="text"
                                value="1"
                                className="w-full text-center text-sm font-medium text-gray-900 focus:outline-none"
                                readOnly
                            />
                            <button
                                className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                            >
                                <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                        </div>

                        {/* <!-- Add to Cart --> */}
                        <button
                            className="flex-1 bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* <!-- Trust Badges --> */}
                    <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                        <div className="flex flex-col items-center text-center gap-2">
                            <i className="fa-solid fa-truck text-gray-400"></i>
                            <span className="text-xs text-gray-500">Free Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <i className="fa-solid fa-shield-halved text-gray-400"></i>
                            <span className="text-xs text-gray-500">2 Year Warranty</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <i className="fa-solid fa-rotate-left text-gray-400"></i>
                            <span className="text-xs text-gray-500">30 Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Tabs Section (Description, Specs, Reviews) --> */}
            <div className="mt-16 border-t border-gray-200 pt-10">
                <div
                    className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar"
                >
                    <button
                        className="px-6 py-4 text-sm font-medium text-black border-b-2 border-black whitespace-nowrap"
                    >
                        Description
                    </button>
                    <button
                        className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-black whitespace-nowrap"
                    >
                        Specifications
                    </button>
                    <button
                        className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-black whitespace-nowrap"
                    >
                        Shipping & Returns
                    </button>
                </div>

                <div className="prose prose-sm text-gray-600 max-w-none">
                    <p>
                        The Minimalist Watch is designed for those who appreciate the finer
                        details. Crafted with precision, this timepiece features a stainless
                        steel case and a genuine leather strap that ages beautifully over
                        time.
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li>Case Diameter: 42mm</li>
                        <li>Case Thickness: 10mm</li>
                        <li>Strap Width: 20mm</li>
                        <li>Movement: Japanese Quartz</li>
                        <li>Water Resistance: 5 ATM</li>
                    </ul>
                </div>
            </div>

            {/* <!-- Related Products --> */}
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* <!-- Related Item 1 --> */}
                    <div className="group">
                        <div
                            className="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1619134778706-c27e0619891a?q=80&w=500&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Leather Wallet</h3>
                        <p className="text-sm text-gray-500 mt-1">$45.00</p>
                    </div>
                    {/* <!-- Related Item 2 --> */}
                    <div className="group">
                        <div
                            className="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Sport Sneakers</h3>
                        <p className="text-sm text-gray-500 mt-1">$110.00</p>
                    </div>
                    {/* <!-- Related Item 3 --> */}
                    <div className="group">
                        <div
                            className="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1572569028738-411a29630962?q=80&w=500&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Cotton Cap</h3>
                        <p className="text-sm text-gray-500 mt-1">$25.00</p>
                    </div>
                    {/* <!-- Related Item 4 --> */}
                    <div className="group">
                        <div
                            className="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=500&auto=format&fit=crop"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Headphones</h3>
                        <p className="text-sm text-gray-500 mt-1">$199.00</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
