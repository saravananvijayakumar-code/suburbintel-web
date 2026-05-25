'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home as HomeIcon, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Routes that use DashboardLayout - hide the public header on these pages
  const dashboardRoutes = [
    '/dashboard',
    '/search',
    '/insights',
    '/compare',
    '/portfolio',
    '/support',
    '/heatmap',
    '/market-trends',
    '/risk-analysis',
    '/mortgage-calculator',
    '/admin/support',
  ]

  const isDashboardRoute = dashboardRoutes.some(route => pathname?.startsWith(route))

  // Don't render the public header on dashboard routes (they have their own sidebar/header)
  if (isDashboardRoute) {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-gray-900 hover:opacity-90 transition flex-shrink-0">
          <HomeIcon className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Suburb Intel AU</h2>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex flex-1 justify-center">
          <Link
            href="/search"
            className={`text-base font-semibold transition ${
              pathname === '/search' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Search
          </Link>
          <Link
            href="/compare"
            className={`text-base font-semibold transition ${
              pathname === '/compare' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Compare
          </Link>
          <Link
            href="/blog"
            className={`text-base font-semibold transition ${
              pathname?.startsWith('/blog') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Blog
          </Link>
          <Link
            href="/news"
            className={`text-base font-semibold transition ${
              pathname === '/news' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            News
          </Link>
          <Link
            href="/about"
            className={`text-base font-semibold transition ${
              pathname === '/about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/search"
              className={`block py-2 text-base font-semibold transition ${
                pathname === '/search' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/compare"
              className={`block py-2 text-base font-semibold transition ${
                pathname === '/compare' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/blog"
              className={`block py-2 text-base font-semibold transition ${
                pathname?.startsWith('/blog') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/news"
              className={`block py-2 text-base font-semibold transition ${
                pathname === '/news' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/about"
              className={`block py-2 text-base font-semibold transition ${
                pathname === '/about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
