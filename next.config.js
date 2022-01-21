/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/time/01/00',
        permanent: true
      },
    ]
  },
}

module.exports = nextConfig
