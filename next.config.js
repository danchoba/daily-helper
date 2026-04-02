/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  webpack: (config) => {
    config.externals.push({ undici: 'commonjs undici' })
    return config
  }
}
module.exports = nextConfig
