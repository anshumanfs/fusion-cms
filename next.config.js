/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'anshumanfs.github.io',
        port: '',
        pathname: '/images/avatar.jpeg',
      },
    ],
  },
  allowedDevOrigins: ['localhost', '127.0.0.1'],
};

module.exports = nextConfig;
