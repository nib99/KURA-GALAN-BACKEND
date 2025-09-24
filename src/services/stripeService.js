const Stripe = require('stripe');
const logger = require('../utils/logger');
const paymentConfig = require('../config/payments');

class StripeService {
  constructor() {
    if (!paymentConfig.stripe.secretKey) {
      throw new Error('Stripe secret key is required');
    }

    this.stripe = new Stripe(paymentConfig.stripe.secretKey, {
      apiVersion: paymentConfig.stripe.apiVersion,
      timeout: paymentConfig.stripe.timeout,
      maxNetworkRetries: paymentConfig.stripe.retries
    });

    logger.info('Stripe service initialized');
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      // Validate currency
      if (!paymentConfig.stripe.supportedCurrencies.includes(currency.toLowerCase())) {
        throw new Error(`Unsupported currency: ${currency}`);
      }

      // Validate minimum amount
      const minAmount = paymentConfig.stripe.minimumAmount[currency.toLowerCase()];
      if (amount < minAmount) {
        throw new Error(`Amount must be at least ${minAmount} ${currency.toUpperCase()}`);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          service: 'kuraa-galaan',
          timestamp: new Date().toISOString()
        },
        automatic_payment_methods: {
          enabled: true
        },
        description: `Donation to Kuraa Galaan - ${metadata.campaignTitle || 'General Fund'}`
      });

      logger.info('Stripe payment intent created', {
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: amount,
        currency: currency.toUpperCase(),
        created: paymentIntent.created
      };

    } catch (error) {
      logger.error('Stripe payment intent creation failed', {
        error: error.message,
        amount,
        currency,
        metadata
      });
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      logger.info('Stripe payment intent retrieved', {
        paymentIntentId,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      });

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        paymentMethod: paymentIntent.payment_method,
        created: paymentIntent.created,
        charges: paymentIntent.charges?.data || []
      };

    } catch (error) {
      logger.error('Stripe payment confirmation failed', {
        error: error.message,
        paymentIntentId
      });
      throw error;
    }
  }

  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          service: 'kuraa-galaan'
        }
      });

      logger.info('Stripe customer created', {
        customerId: customer.id,
        email,
        name
      });

      return customer;

    } catch (error) {
      logger.error('Stripe customer creation failed', {
        error: error.message,
        email,
        name
      });
      throw error;
    }
  }

  async createSubscription(customerId, priceId, metadata = {}) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          ...metadata,
          service: 'kuraa-galaan'
        }
      });

      logger.info('Stripe subscription created', {
        subscriptionId: subscription.id,
        customerId,
        priceId,
        status: subscription.status
      });

      return subscription;

    } catch (error) {
      logger.error('Stripe subscription creation failed', {
        error: error.message,
        customerId,
        priceId
      });
      throw error;
    }
  }

  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason,
        metadata: {
          service: 'kuraa-galaan',
          timestamp: new Date().toISOString()
        }
      });

      logger.info('Stripe refund created', {
        refundId: refund.id,
        paymentIntentId,
        amount: refund.amount / 100,
        status: refund.status
      });

      return refund;

    } catch (error) {
      logger.error('Stripe refund failed', {
        error: error.message,
        paymentIntentId,
        amount
      });
      throw error;
    }
  }

  verifyWebhookSignature(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        paymentConfig.stripe.webhookSecret
      );

      logger.debug('Stripe webhook signature verified', {
        eventType: event.type,
        eventId: event.id
      });

      return event;

    } catch (error) {
      logger.error('Stripe webhook signature verification failed', {
        error: error.message
      });
      throw error;
    }
  }

  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return paymentMethods.data;

    } catch (error) {
      logger.error('Failed to get payment methods', {
        error: error.message,
        customerId
      });
      throw error;
    }
  }

  async getTransactionHistory(customerId, limit = 10) {
    try {
      const charges = await this.stripe.charges.list({
        customer: customerId,
        limit
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency.toUpperCase(),
        status: charge.status,
        created: charge.created,
        description: charge.description,
        receiptUrl: charge.receipt_url
      }));

    } catch (error) {
      logger.error('Failed to get transaction history', {
        error: error.message,
        customerId
      });
      throw error;
    }
  }
}

module.exports = new StripeService();