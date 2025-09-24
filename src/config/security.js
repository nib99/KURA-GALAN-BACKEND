const helmet = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: [
        "'self'", 
        "https://js.stripe.com", 
        "https://checkout.chapa.co",
        "https://api.telebirr.com"
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'", 
        "https:", 
        "wss:",
        "https://api.stripe.com",
        "https://api.chapa.co",
        "https://api.telebirr.com"
      ],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:", "blob:"],
      frameSrc: [
        "'self'", 
        "https://js.stripe.com", 
        "https://hooks.stripe.com",
        "https://checkout.chapa.co"
      ],
      childSrc: ["'self'", "blob:"],
      workerSrc: ["'self'", "blob:"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
};

const security = {
  helmet,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
  
  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  
  // File upload limits
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // API versioning
  apiVersion: 'v1',
  
  // Webhook security
  webhookTimeout: 30000, // 30 seconds
  
  // Database security
  queryTimeout: 30000, // 30 seconds
  connectionTimeout: 10000, // 10 seconds
};

// Validate required secrets in production
if (process.env.NODE_ENV === 'production') {
  const requiredSecrets = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'SESSION_SECRET'];
  const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);
  
  if (missingSecrets.length > 0) {
    throw new Error(`Missing required environment variables: ${missingSecrets.join(', ')}`);
  }
}

module.exports = security;