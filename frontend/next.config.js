/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the most basic configuration possible to avoid webpack issues
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  swcMinify: false,
  trailingSlash: true,
};

module.exports = nextConfig;
