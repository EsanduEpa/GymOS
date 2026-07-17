export default () => ({
  // Application
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'gymos-jwt-secret-change-me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'gymos-refresh-secret-change-me',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // PayHere
  payhere: {
    merchantId: process.env.PAYHERE_MERCHANT_ID || '',
    merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || '',
    sandbox: process.env.PAYHERE_SANDBOX === 'true' || process.env.NODE_ENV !== 'production',
    notifyUrl: process.env.PAYHERE_NOTIFY_URL || 'http://localhost:3000/api/payments/webhook',
    returnUrl: process.env.PAYHERE_RETURN_URL || 'http://localhost:4200/payment/success',
    cancelUrl: process.env.PAYHERE_CANCEL_URL || 'http://localhost:4200/payment/cancel',
  },

  // CORS
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:4200').split(','),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
});
