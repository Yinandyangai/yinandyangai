/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Server actions on by default in Next 14; nothing to flag.
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
