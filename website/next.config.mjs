/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/cook", destination: "/", permanent: true },
      { source: "/cook/nearby", destination: "/nearby", permanent: true },
      { source: "/app", destination: "/", permanent: true },
      { source: "/app/nearby", destination: "/nearby", permanent: true },
    ];
  },
};

export default nextConfig;
