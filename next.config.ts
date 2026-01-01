/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost:5000' }
    ],
  }

};

module.exports = nextConfig;