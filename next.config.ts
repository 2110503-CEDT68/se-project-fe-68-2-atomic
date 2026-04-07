import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['drive.google.com', 'drive.usercontent.google.com']
  },
  // เพิ่มส่วนนี้เข้าไปครับ
  async rewrites() {
    return [
      {
        // เมื่อเราเรียก /api-proxy/... ในเครื่องตัวเอง
        source: '/api-proxy/:path*',
        // ให้ส่งต่อไปที่ Backend จริงๆ บน Vercel
        destination: 'https://frontend-project-backend.vercel.app/api/:path*',
      },
    ]
  },
};

export default nextConfig;