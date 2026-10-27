/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
