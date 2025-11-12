/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Removed 'output: export' to support dynamic auth pages
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: "named",
      chunkIds: "named",
    };
    return config;
  },
};

export default nextConfig;
