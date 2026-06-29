import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The @ikc/ai-core workspace package ships TypeScript source; Next compiles it.
  transpilePackages: ["@ikc/ai-core"],
};

export default nextConfig;
