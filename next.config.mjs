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
  output: "export",
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
