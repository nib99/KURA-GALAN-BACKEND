# Kuraa Galaan Charity Backend

A comprehensive charity donation backend system for Kuraa Galaan, supporting multiple payment gateways including Stripe, Chapa, and Telebirr. Built with Node.js, Express, and Prisma ORM, optimized for deployment on Render and integrated with the Vercel frontend.

## 🌟 Features

### Payment Gateways
- **Stripe**: International payment processing with 135+ currencies
- **Chapa**: Ethiopian payment gateway for local transactions
- **Telebirr**: Ethiopian mobile payment integration

### Core Features
- Multi-currency donation support (ETB, USD, EUR)
- Campaign management system
- User authentication & profiles
- Real-time donation tracking
- Email notifications
- Admin dashboard APIs
- Donation receipts & certificates
- Recurring donations support
- Anonymous donation option
- Multi-language support (Amharic/English)

### Security & Performance
- JWT authentication with refresh tokens
- Rate limiting and DDoS protection
- Input validation and sanitization
- CORS configured for Vercel frontend
- Helmet security headers
- Payment webhook verification
- Database encryption
- Comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Payment gateway accounts (Stripe, Chapa, Telebirr)

### Installation

1. **Clone and setup**
   ```bash
   cd kuraa-galaan-backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment on Render

### 1. Database Setup
1. Create PostgreSQL database on Render
2. Copy the database URL to your environment variables

### 2. Web Service Setup
1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add all environment variables from .env.example

### 3. Environment Variables
Configure these essential variables in Render:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Strong secret for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `CHAPA_SECRET_KEY`: Your Chapa secret key
- `TELEBIRR_APP_KEY`: Your Telebirr app key
- `FRONTEND_URL`: https://kuraa-galaan-website.vercel.app

### 4. Webhook Configuration
After deployment, configure webhooks in payment dashboards:
- Stripe: `https://your-backend.onrender.com/api/webhooks/stripe`
- Chapa: `https://your-backend.onrender.com/api/webhooks/chapa`
- Telebirr: `https://your-backend.onrender.com/api/webhooks/telebirr`

## 📚 API Documentation

### Base URL
```
Production: https://your-backend.onrender.com/api
Development: http://localhost:3000/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password

### Donation Endpoints
- `POST /donations` - Create new donation
- `GET /donations` - Get donations (paginated)
- `GET /donations/:id` - Get donation details
- `POST /donations/:id/receipt` - Generate receipt
- `GET /donations/stats` - Get donation statistics

### Campaign Endpoints
- `GET /campaigns` - List active campaigns
- `POST /campaigns` - Create campaign (admin)
- `GET /campaigns/:id` - Get campaign details
- `PUT /campaigns/:id` - Update campaign (admin)
- `DELETE /campaigns/:id` - Delete campaign (admin)

### Payment Endpoints
- `POST /payments/stripe/intent` - Create Stripe payment intent
- `POST /payments/chapa/initialize` - Initialize Chapa payment
- `POST /payments/telebirr/initialize` - Initialize Telebirr payment
- `GET /payments/:id/status` - Check payment status

### Webhook Endpoints
- `POST /webhooks/stripe` - Stripe payment webhooks
- `POST /webhooks/chapa` - Chapa payment webhooks
- `POST /webhooks/telebirr` - Telebirr payment webhooks

## 💳 Payment Gateway Setup

### Stripe Setup
1. Create account at stripe.com
2. Get API keys from dashboard
3. Configure webhooks for payment events
4. Add keys to environment variables

### Chapa Setup (Ethiopia)
1. Register at chapa.co
2. Complete business verification
3. Get API credentials from dashboard
4. Configure webhook URL
5. Add credentials to environment

### Telebirr Setup (Ethiopia)
1. Contact Ethio Telecom for API access
2. Complete integration requirements
3. Get app credentials and short code
4. Configure webhook endpoint
5. Add credentials to environment

## 🧪 Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 📊 Monitoring & Health Checks

- Health check: `GET /health`
- Metrics: `GET /api/admin/metrics`
- System status: `GET /api/admin/status`
- Logs: Available in Render dashboard

## 🔒 Security Features

- All payments processed through official gateways
- Sensitive data encrypted at rest
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS protection for frontend integration
- Helmet security headers
- JWT token expiration and refresh
- Password hashing with bcrypt

## 🌍 Frontend Integration

This backend is pre-configured to work with:
```
https://kuraa-galaan-website.vercel.app
```

### CORS Configuration
The backend allows requests from:
- https://kuraa-galaan-website.vercel.app
- http://localhost:3000 (development)
- Your custom domain

### API Usage Example
```javascript
// Create donation
const response = await fetch('https://your-backend.onrender.com/api/donations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    campaignId: 'campaign-id',
    amount: 100,
    currency: 'ETB',
    paymentMethod: 'chapa'
  })
});
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@kuraagalaan.org
- Documentation: /docs
- Issues: GitHub Issues

## 🌍 Multi-Currency & Localization

### Supported Currencies
- ETB (Ethiopian Birr) - Primary
- USD (US Dollar)
- EUR (Euro)

### Language Support
- English (default)
- Amharic (አማርኛ)

## 📱 Mobile & Responsive Support

The API is optimized for:
- Mobile web applications
- Progressive Web Apps (PWA)
- Native mobile app integration
- Responsive web interfaces

## 🔄 Data Flow

1. **Frontend** (Vercel) → **Backend** (Render) → **Database** (PostgreSQL)
2. **Payment Gateway** → **Webhook** → **Backend** → **Database**
3. **Admin Dashboard** → **Backend** → **Database**

## 🚀 Performance Optimizations

- Database query optimization
- Response caching
- Compression middleware
- Rate limiting
- Connection pooling
- Efficient pagination
- Background job processing

---

**Kuraa Galaan** - Making a difference in Ethiopian communities through technology and compassion.
