import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // เพิ่ม hostname เหล่านี้เข้าไปเพื่อให้ Next.js ยอมรับรูปจาก Google
    domains: [
      'drive.google.com', 
      'drive.usercontent.google.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'googleusercontent.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://frontend-project-backend.vercel.app/api/:path*',
      },
    ]
  },
};

export default nextConfig;