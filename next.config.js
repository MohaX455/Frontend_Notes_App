const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    unoptimized: true,
  },

  exports: "standalone"
};

module.exports = nextConfig;