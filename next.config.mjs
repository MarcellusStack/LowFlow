/** @type {import('next').NextConfig} */
const nextConfig = {
  staleTimes: {
    dynamic: 0,
    static: 300,
  },
};

export default nextConfig;
