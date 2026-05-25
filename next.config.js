/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/manifest\.json$/],
})

const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },

  serverExternalPackages: [],

  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "img-src 'self' data: https: blob:; " +
              "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com; " +
              "worker-src 'self' blob:; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self';",
          },
        ],
      },
    ]
  },

  // Redirects: legacy paid/auth routes now bounce to home.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/pricing', destination: '/', permanent: true },
      { source: '/subscription', destination: '/', permanent: true },
      { source: '/subscription/:path*', destination: '/', permanent: true },
      { source: '/login', destination: '/', permanent: true },
      { source: '/signup', destination: '/', permanent: true },
      { source: '/sign-up', destination: '/', permanent: true },
      { source: '/sign-in', destination: '/', permanent: true },
      { source: '/forgot-password', destination: '/', permanent: true },
      { source: '/reset-password', destination: '/', permanent: true },
    ]
  },

  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

module.exports = withPWA(nextConfig)
