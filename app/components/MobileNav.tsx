'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Menu, X, Home, Search, TrendingUp, MapPin, Calculator, 
  FileText, Bell, User, ChevronDown, Star, BarChart3 
} from 'lucide-react'

const mainNav = [
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Best Suburbs', href: '/best-suburbs', icon: TrendingUp },
  { name: 'Heatmap', href: '/heatmap', icon: MapPin },
  { name: 'Compare', href: '/compare', icon: BarChart3 },
]

const moreNav = [
  { name: 'Calculator', href: '/mortgage-calculator', icon: Calculator },
  { name: 'About', href: '/about', icon: Star },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Home className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg">Suburb Intel</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation items continue below */}

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </p>
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tools
                </p>
                {moreNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Quick Links */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <Link href="/about" onClick={() => setIsOpen(false)} className="py-2 text-gray-600 hover:text-blue-600">
                  About
                </Link>
                <Link href="/blog" onClick={() => setIsOpen(false)} className="py-2 text-gray-600 hover:text-blue-600">
                  Blog
                </Link>
                <Link href="/support" onClick={() => setIsOpen(false)} className="py-2 text-gray-600 hover:text-blue-600">
                  Support
                </Link>
                <Link href="/privacy" onClick={() => setIsOpen(false)} className="py-2 text-gray-600 hover:text-blue-600">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-40 safe-area-bottom">
        <nav className="flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600">
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link href="/best-suburbs" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Trending</span>
          </Link>
          <Link href="/heatmap" className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs">Map</span>
          </Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">More</span>
          </button>
        </nav>
      </div>
    </>
  )
}
