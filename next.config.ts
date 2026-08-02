import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.103", "192.168.0.102"],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.instantdb.com",
      },
      {
        protocol: "https",
        hostname: "instant-storage.s3.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
