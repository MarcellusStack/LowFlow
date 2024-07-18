/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 300,
    },
  },
};

export default nextConfig;
