/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify images
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com', // Apple Music images
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com', // Imgur images
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash images
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Vercel Blob Storage
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
