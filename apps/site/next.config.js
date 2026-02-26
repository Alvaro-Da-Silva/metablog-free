/** @type {import('next').NextConfig} */

const API_BASE = process.env.APIBLOG_BASE_URL
  || process.env.NEXT_PUBLIC_APIBLOG_BASE_URL
  || 'https://labtec.satc.edu.br/dev/blog-labtec/api'

const USER_API_BASE = process.env.USER_API_BASE_URL
  || 'https://labtec.satc.edu.br/dev/labtecone/api'

const nextConfig = {
   experimental: {
      appDir: true,
   },
   // image optimization
   images: {
      domains: ['placehold.co', 'via.placeholder.com'],
   },
   basePath: process.env.NEXT_PUBLIC_BASE_URL || '',
   async rewrites() {
      return [
         {
            source: '/api/blog/:path*',
            destination: `${API_BASE}/:path*`,
         },
         {
            source: '/api/users/:path*',
            destination: `${USER_API_BASE}/users/:path*`,
         },
      ]
   },
}

module.exports = nextConfig
