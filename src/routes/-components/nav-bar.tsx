'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Menu,
    X,
    Search,
    User,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes you have a utility for classes, or use template literals
import { Link, useLocation } from '@tanstack/react-router';

// --- Types ---
interface NavLink {
    label: string;
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { label: 'New Arrivals', href: '/shop/new' },
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(2); // Example state
    const { pathname } = useLocation()

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* --- Main Navbar --- */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
                    isScrolled
                        ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
                        : 'bg-transparent py-5'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* 1. Mobile Menu Button (Left) */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* 2. Logo (Center/Left) */}
                        <div className="shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
                            <Link to={'/'} className="group">
                                {/* <span className={cn(
                                    "text-2xl font-bold tracking-tight transition-colors",
                                    isScrolled ? "text-gray-900" : "text-gray-900 md:text-white"
                                )}>
                                    BUYBRO<span className="text-indigo-600">.</span>
                                </span> */}
                                <img src='/assets/logo.png' className='w-[100px]' />
                            </Link>
                        </div>

                        {/* 3. Desktop Navigation (Center) */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-indigo-600 relative group",
                                        pathname === link.href
                                            ? "text-gray-900"
                                            : "text-gray-600"
                                    )}
                                >
                                    {link.label}
                                    {/* Underline Animation */}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* 4. Icons / Actions (Right) */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Search (Hidden on small mobile, visible on md+) */}
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                                <Search size={20} strokeWidth={1.5} />
                            </button>

                            {/* User */}
                            <Link to="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <User size={20} strokeWidth={1.5} />
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Mobile Menu Overlay --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <span className="text-xl font-bold">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex-1 overflow-y-auto py-6 px-5">
                                <div className="space-y-6">
                                    {NAV_LINKS.map((link, index) => (
                                        <motion.div
                                            key={link.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                to={link.href}
                                                className="flex items-center justify-between text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                                            >
                                                {link.label}
                                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100" />
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <div className="pt-6 border-t border-gray-100">
                                        <Link to="/" className="flex items-center space-x-3 text-gray-600 mb-4">
                                            <User size={20} />
                                            <span>My Account</span>
                                        </Link>
                                        <Link to="/" className="flex items-center space-x-3 text-gray-600">
                                            <Search size={20} />
                                            <span>Search Products</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Footer / CTA */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50">
                                <Link
                                    to="/"
                                    className="flex items-center justify-center w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}