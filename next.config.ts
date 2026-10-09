import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ข้ามการตรวจ TypeScript Error ตอน npm run build
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    // ข้ามการตรวจ ESLint Warning/Error ตอน build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;