import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function ProductCard({ data }: { data: Product }) {
    return (
        <Link to={`/products/${data.id}`} className='group relative'>
            {/* <!-- Image Container --> */}
            <div
                className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 relative"
            >
                <img
                    src={data.images}
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
                            {data.name}
                        </a>
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">Accessories</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">${data.price}</p>
            </div>

            {/* <!-- Add to Cart (Visible on Hover for Desktop, Always for Mobile logic handled by CSS) --> */}
            <button
                className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-100 group-hover:opacity-100 transition-opacity md:block"
            >
                Add to Cart
            </button>
        </Link>
    )
}