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
};

module.exports = nextConfig;
