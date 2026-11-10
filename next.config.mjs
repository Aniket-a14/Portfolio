/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  productionBrowserSourceMaps: false, // Disables source maps in production for security
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    // AVIF/WebP with a long immutable cache; the project artwork never changes
    // under a given filename.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 128, 256, 384],
    // Medium article covers are optimised too (a single cover was a 1.1 MB PNG).
    remotePatterns: [{ protocol: "https", hostname: "**.medium.com" }],
  },
  experimental: {
    // These three are barrel packages: a bare `import { X } from "react-icons/fa"`
    // pulls the whole icon set into the client bundle without this.
    optimizePackageImports: ["lucide-react", "react-icons", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};


export default nextConfig;
