/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "*.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "countryroof.in" },
      { protocol: "https", hostname: "www.countryroof.in" },
    ],
    formats: ["image/avif", "image/webp"],
    // Optimized device sizes for mobile-first LCP
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configure allowed quality values for images
    qualities: [75, 80, 85],
    // Minimize image memory for faster decoding
    minimumCacheTTL: 31536000,
    // Prioritize loading LCP images
    unoptimized: false,
  },
  experimental: {
    // Tree-shake heavy packages to reduce unused JS
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "date-fns",
      "recharts",
      "embla-carousel-react",
      "react-day-picker",
      "sonner",
      "next-themes",
      "cmdk",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
    ppr: false,
  },
  transpilePackages: [],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  reactStrictMode: true,
  
  // Remove legacy polyfills for modern browsers only (saves ~14KB)
  // Using Turbopack alias to replace polyfill module with empty file
  turbopack: {
    resolveAlias: {
      '../build/polyfills/polyfill-module': './lib/modern-polyfill.js',
      'next/dist/build/polyfills/polyfill-module': './lib/modern-polyfill.js',
    },
  },
  
  // Webpack fallback for when not using Turbopack
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '../build/polyfills/polyfill-module': false,
      'next/dist/build/polyfills/polyfill-module': false,
    };
    return config;
  },
  
  // Disable caching for API routes and pages to ensure fresh data
  async headers() {
    return [
      {
        // Apply to all API routes - critical for auth and data
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Surrogate-Control", value: "no-store" },
        ],
      },
      {
        // Auth API routes - extra strict no-cache (prevents session sharing)
        source: "/api/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "Surrogate-Control", value: "no-store" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to admin pages
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to agent pages
        source: "/agent/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to buyer/builder dashboard pages
        source: "/buyer/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to builder dashboard pages
        source: "/builder/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Apply to dashboard pages
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Cache banner images aggressively for better LCP
        source: "/banners/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache home banner images (home-banner-1.jpg, etc.)
        source: "/:filename(home-banner-.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // 1. Existing www redirects
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.countryroof.in" }],
        destination: "https://countryroof.in/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "roof.countryroof.in" }],
        destination: "https://countryroof.in/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "roof.countryroof.in" }],
        destination: "https://countryroof.in/:path+",
        permanent: true,
      },
      // 2. Legacy property detail URLs - redirect to new format
      // Format: /property/details/:id/:slug -> /properties/residential/:slug
      {
        source: "/property/details/22/m3m-mansion",
        destination: "/properties/residential/m3m-mansion",
        permanent: true,
      },
      {
        source: "/property/details/41/m3m-altitude",
        destination: "/properties/residential/m3m-altitude",
        permanent: true,
      },
      {
        source: "/property/details/57/consicent--parq",
        destination: "/properties/residential/conscient-parq",
        permanent: true,
      },
      {
        source: "/property/details/72/ganga-anantam",
        destination: "/properties/residential/ganga-anantam",
        permanent: true,
      },
      {
        source: "/property/details/73/emaar-urban-ascent",
        destination: "/properties/residential/emaar-urban-ascent",
        permanent: true,
      },
      // Catch-all for any other old property detail URLs
      {
        source: "/property/details/:id/:slug",
        destination: "/properties/residential/:slug",
        permanent: true,
      },
      // 3. Legacy state detail URLs - redirect to properties
      {
        source: "/state/details/:id",
        destination: "/properties",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
