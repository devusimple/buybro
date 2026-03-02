const mock_product: {
    id: number,
    name: string,
    category: string,
    image: string,
    price: number
}[] = [
        {
            id: 1,
            name: 'Red Runner Sport',
            category: "",
            price: 100,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        },
        {
            id: 2,
            name: 'Minimalist Watch',
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
            category: 'Accessories',
            price: 120,
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
            name: "Denim Jacket",
            category: "",
            price: 10
        }
    ]

export default function ProductCard({ img, name }: { img: string, name: string }) {
    return (
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
                className="mt-2 w-full bg-gray-100 text-gray-900 text-xs font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
            >
                Add to Cart
            </button>
        </div>
    )
}