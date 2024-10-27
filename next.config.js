/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  telemetry: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/audio/:path*',
        destination: '/api/files/getAudio?filename=:path*',
      },
    ];
  },
};

module.exports = nextConfig;
