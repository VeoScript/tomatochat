/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VERCEL_BASE_URL: process.env.VERCEL_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    TWITTER_CLIENT_BEARER_TOKEN: process.env.TWITTER_CLIENT_BEARER_TOKEN,
    TWITTER_CLIENT_TOKEN_SECRET: process.env.TWITTER_CLIENT_TOKEN_SECRET,
    IMGBB_API: process.env.IMGBB_API
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'scontent.fceb2-2.fna.fbcdn.net',
      'i.ibb.co'
    ]
  }
}

module.exports = nextConfig
