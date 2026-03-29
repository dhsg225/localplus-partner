/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/explainer/:path*',
        destination: '/answer-engine/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
