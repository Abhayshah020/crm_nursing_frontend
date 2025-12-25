/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  matcher: [
    /*
      Match all routes except:
      - api routes
      - static files
      - images
      - favicon
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

module.exports = nextConfig;