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
  webpack: (config) => {
    // This fixes issues with problematic dependencies
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify'),
    };
    
    return config;
  },
};

module.exports = nextConfig;
