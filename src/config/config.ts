export const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_ACCESS_EXPIRY: '7d',
  JWT_REFRESH_EXPIRY: '7d',
}
