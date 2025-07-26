import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://picsum.photos/*/**"),
      new URL("https://placehold.co/*/**"),
      new URL("https://gateway.pinata.cloud/*/**"),
    ],
  },
};

export default nextConfig;
