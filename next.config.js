/**@type {import('next').NextConfig} /*/

module.exports = {
  distDir: ".next",
  env: {},
  experimental: {},
  future: {},
  images: {
    domains: ["https://www.publishersweekly.com"]
  },
  i18n: {
    locales: ["en" , 'bg'],
    defaultLocale: "en",  
  },
  trailingSlash: true,
}

