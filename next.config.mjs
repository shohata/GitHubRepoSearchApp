/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Dockerビルド用のstandaloneモード設定
  output: "standalone",
};

export default nextConfig;
