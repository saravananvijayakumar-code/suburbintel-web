'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home as HomeIcon } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Routes that use DashboardLayout - hide the public footer on these pages
  const dashboardRoutes = [
    '/dashboard',
    '/search',
    '/insights',
    '/compare',
    '/portfolio',
    '/support',
    '/heatmap',
    '/market-trends',
    '/reports',
    '/risk-analysis',
    '/mortgage-calculator',
    '/admin/support',
  ]

  const isDashboardRoute = dashboardRoutes.some(route => pathname?.startsWith(route))

  if (isDashboardRoute) {
    return null
  }

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 text-gray-900 mb-4">
              <HomeIcon className="w-6 h-6" />
              <h2 className="text-lg font-bold">Suburb Intel AU</h2>
            </div>
            <p className="text-sm text-gray-600">
              Data-driven insights for smarter Australian property investing.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/search" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Blog
                </Link>
              </li>
              <li>
                <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="mailto:saravananvijayakumar@quantumleapventures.com.au" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/data-sources" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Legal Disclaimer</h4>
            <p className="text-xs text-yellow-700 leading-relaxed">
              This website provides information for educational and research purposes only. All content, data, and analysis do not constitute financial advice, investment advice, or any form of professional financial planning. Property investment involves significant risk. SuburbIntel is not licensed by ASIC and does not provide financial product advice. Always seek independent professional advice before making investment decisions.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">© 2025 Suburb Intel AU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
