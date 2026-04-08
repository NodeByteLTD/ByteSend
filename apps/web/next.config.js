/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: process.env.DOCKER_OUTPUT ? "standalone" : undefined,
  serverExternalPackages: ["bullmq"],
  transpilePackages: ["@bytesend/ui", "@bytesend/email-editor"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "cmap.pics",
      },
      {
        protocol: "https",
        hostname: "embrly.ca",
      },
    ],
  },
  async headers() {
    // Only add caching headers in production — in dev they break HMR
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        // Immutable cache for Next.js static chunks (they have content-hash in filename)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Long cache for public static assets
        source: "/:path*.:ext(ico|png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default config;
