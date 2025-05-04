/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
