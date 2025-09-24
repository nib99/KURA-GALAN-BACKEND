const logger = require('../utils/logger');

const paymentConfig = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    apiVersion: '2023-10-16',
    timeout: 30000,
    retries: 3,
    supportedCurrencies: ['usd', 'eur', 'etb'],
    minimumAmount: {
      usd: 0.50,
      eur: 0.50,
      etb: 10
    }
  },
  
  chapa: {
    secretKey: process.env.CHAPA_SECRET_KEY,
    publicKey: process.env.CHAPA_PUBLIC_KEY,
    webhookSecret: process.env.CHAPA_WEBHOOK_SECRET,
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.chapa.co/v1' 
      : 'https://api.chapa.co/v1',
    timeout: 30000,
    retries: 3,
    supportedCurrencies: ['ETB'],
    minimumAmount: {
      ETB: 10
    }
  },
  
  telebirr: {
    appId: process.env.TELEBIRR_APP_ID,
    appKey: process.env.TELEBIRR_APP_KEY,
    shortCode: process.env.TELEBIRR_SHORT_CODE,
    webhookSecret: process.env.TELEBIRR_WEBHOOK_SECRET,
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.telebirr.com'
      : 'https://api.telebirr.com',
    timeout: 30000,
    retries: 3,
    supportedCurrencies: ['ETB'],
    minimumAmount: {
      ETB: 5
    }
  },
  
  // General payment settings
  general: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'ETB',
    supportedCurrencies: (process.env.SUPPORTED_CURRENCIES || 'ETB,USD,EUR').split(','),
    maxAmount: 1000000, // Maximum donation amount
    webhookRetries: 3,
    webhookRetryDelay: 5000, // 5 seconds
    transactionTimeout: 300000, // 5 minutes
    
    // Currency conversion (if needed)
    exchangeRates: {
      'USD_TO_ETB': 55.0,
      'EUR_TO_ETB': 60.0,
      'ETB_TO_USD': 0.018,
      'ETB_TO_EUR': 0.017
    }
  }
};

// Validate payment configuration
function validatePaymentConfig() {
  const errors = [];
  
  // Validate Stripe config
  if (!paymentConfig.stripe.secretKey) {
    errors.push('STRIPE_SECRET_KEY is required');
  }
  
  // Validate Chapa config
  if (!paymentConfig.chapa.secretKey) {
    errors.push('CHAPA_SECRET_KEY is required');
  }
  
  // Validate Telebirr config
  if (!paymentConfig.telebirr.appId || !paymentConfig.telebirr.appKey) {
    errors.push('TELEBIRR_APP_ID and TELEBIRR_APP_KEY are required');
  }
  
  if (errors.length > 0 && process.env.NODE_ENV === 'production') {
    logger.error('Payment configuration errors:', errors);
    throw new Error(`Payment configuration errors: ${errors.join(', ')}`);
  }
  
  if (errors.length > 0) {
    logger.warn('Payment configuration warnings:', errors);
  }
}

// Initialize payment configuration
validatePaymentConfig();

logger.info('Payment gateways configured:', {
  stripe: !!paymentConfig.stripe.secretKey,
  chapa: !!paymentConfig.chapa.secretKey,
  telebirr: !!paymentConfig.telebirr.appId,
  supportedCurrencies: paymentConfig.general.supportedCurrencies
});

module.exports = paymentConfig;