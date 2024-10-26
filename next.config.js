module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/files/download/:path*',
      },
      {
        source: '/api/files/getAudio',
        destination: '/api/files/[action]?action=getAudio',
      },
    ];
  },
};
