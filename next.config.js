/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'anshumanfs.github.io',
        port: '',
        pathname: '/images/avatar.jpg',
      },
    ],
  },
};

module.exports = nextConfig;
