import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/_app/cart')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* <!-- Left Column: Cart Items --> */}
                <div className="flex-1">
                    <div
                        className="bg-white"
                    >
                        <ul className="divide-y divide-gray-100">
                            {/* <!-- Item 1 --> */}
                            <li className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* <!-- Image --> */}
                                <div
                                    className="w-full sm:w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                                        alt="Watch"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* <!-- Details --> */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                <a href="#">Minimalist Watch</a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Color: Black | Size: 42mm
                                            </p>
                                        </div>
                                        <p className="text-base font-medium text-gray-900">$120.00</p>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        {/* <!-- Quantity Controls --> */}
                                        <div
                                            className="flex items-center border border-gray-300 rounded-lg"
                                        >
                                            <Button
                                                variant={'ghost'}
                                                size={'icon-sm'}
                                            >
                                                <Minus strokeWidth={1} className='cursor-pointer' />
                                            </Button>
                                            <span
                                                className="w-8 text-center text-sm font-medium text-gray-900"
                                            >1</span
                                            >
                                            <Button
                                                variant={'ghost'}
                                                size={'icon-sm'}
                                            >
                                                <Plus strokeWidth={1} className='cursor-pointer' />
                                            </Button>
                                        </div>

                                        {/* <!-- Remove Button --> */}
                                        <Button
                                            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 size={16} strokeWidth={1} /> Remove
                                        </Button>
                                    </div>
                                </div>
                            </li>

                            {/* <!-- Item 2 --> */}
                            <li className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <div
                                    className="w-full sm:w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"
                                        alt="Shoe"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                <a href="#">Red Runner Sport</a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Color: Red | Size: US 10
                                            </p>
                                        </div>
                                        <p className="text-base font-medium text-gray-900">$85.00</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div
                                            className="flex items-center border border-gray-300 rounded-lg"
                                        >
                                            <Button
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                                            >
                                                <Minus strokeWidth={0.5} className='cursor-pointer' />
                                            </Button>
                                            <span
                                                className="w-8 text-center text-sm font-medium text-gray-900"
                                            >1</span
                                            >
                                            <Button
                                            >
                                                <Plus strokeWidth={0.5} className='cursor-pointer' />
                                            </Button>
                                        </div>
                                        <Button
                                            type="Button"
                                            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 size={16} strokeWidth={1} /> Remove
                                        </Button>
                                    </div>
                                </div>
                            </li>

                            {/* <!-- Item 3 --> */}
                            <li className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <div
                                    className="w-full sm:w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
                                        alt="Jacket"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                <a href="#">Denim Jacket</a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Color: Blue | Size: M
                                            </p>
                                        </div>
                                        <p className="text-base font-medium text-gray-900">$64.00</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div
                                            className="flex items-center border border-gray-300 rounded-lg"
                                        >
                                            <Button
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                                            >
                                                <Minus strokeWidth={0.5} className='cursor-pointer' />
                                            </Button>
                                            <span
                                                className="w-8 text-center text-sm font-medium text-gray-900"
                                            >2</span
                                            >
                                            <Button
                                            >
                                                <Plus strokeWidth={0.5} className='cursor-pointer' />
                                            </Button>
                                        </div>
                                        <Button
                                            type="Button"
                                            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 size={16} strokeWidth={1} /> Remove
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        {/* <!-- Cart Actions (Mobile Only usually, but good for desktop too) --> */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                            <a
                                href="#"
                                className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                <ArrowLeft /> Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>

                {/* <!-- Right Column: Order Summary --> */}
                <div className="w-full lg:w-96 shrink-0">
                    <div
                        className="bg-white border-l p-6 sticky top-24"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="flow-root">
                            <dl className="-my-4 text-sm divide-y divide-gray-100">
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-600">Subtotal</dt>
                                    <dd className="font-medium text-gray-900">$333.00</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-600">Shipping Estimate</dt>
                                    <dd className="font-medium text-gray-900">$5.00</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-600">Tax Estimate</dt>
                                    <dd className="font-medium text-gray-900">$26.64</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-base font-bold text-gray-900">Order Total</dt>
                                    <dd className="text-base font-bold text-gray-900">$364.64</dd>
                                </div>
                            </dl>
                        </div>

                        {/* <!-- Promo Code --> */}
                        <div className="mt-6">
                            <form className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Discount code"
                                    className="flex-1 block w-full rounded-lg border-gray-300 bg-gray-50 border px-3 py-2 text-sm focus:border-black focus:ring-black focus:outline-none"
                                />
                                <Button
                                    type="Button"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Apply
                                </Button>
                            </form>
                        </div>

                        {/* <!-- Checkout Button --> */}
                        <div className="mt-6">
                            <Button
                                className="w-full bg-black text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                            >
                                Checkout
                            </Button>
                        </div>

                        {/* <!-- Trust Badges --> */}
                        <div className="mt-6 flex justify-center gap-4 text-gray-400">
                            <i className="fa-brands fa-cc-visa text-2xl"></i>
                            <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                            <i className="fa-brands fa-cc-paypal text-2xl"></i>
                            <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </main>

    )
}
