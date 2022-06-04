/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next Images from outside source should be configured in next.config.js to allow the domain
  images: {
    domains: ["static.tvmaze.com"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
