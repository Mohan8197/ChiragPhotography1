import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Local portfolio images are served directly, so we skip the
    // Next.js optimizer and let next/image build the srcset against it.
    loader: "custom",
    loaderFile: "./lib/unsplash-loader.ts",
    qualities: [60, 75],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 192, 256, 384],
  },
};

export default nextConfig;
