# P2P Crypto Trading Platform

A professional peer-to-peer cryptocurrency trading platform with Bybit integration, multi-language support, and KYC verification.

## Features

- 🔄 **Real-time P2P Trading** - Buy and sell crypto with other users
- 📊 **Bybit Integration** - Fetch and display live orders from Bybit
- 🌍 **Multi-language Support** - English, Ukrainian, Russian, Spanish, Chinese
- 🔐 **KYC Verification** - Secure user verification system
- 💬 **Live Chat** - Real-time messaging between traders
- 🔔 **Notifications** - WebSocket-based real-time updates
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful interface with smooth animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- i18next for internationalization
- React Query for data fetching
- Zustand for state management
- Socket.io-client for real-time updates

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for WebSocket
- JWT authentication with 2FA
- Bybit API integration
- Redis for caching

## Project Structure

```
/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── i18n/          # Translations
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── config/        # Configuration
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis (optional, for caching)
- Bybit API credentials

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables:

**Server (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/p2p-trading
JWT_SECRET=your_jwt_secret
BYBIT_API_KEY=your_bybit_api_key
BYBIT_API_SECRET=your_bybit_api_secret
REDIS_URL=redis://localhost:6379
KYC_PROVIDER_API_KEY=your_kyc_api_key
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

4. Run the application:

```bash
# Start server
cd server
npm run dev

# Start client (in another terminal)
cd client
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-2fa` - Verify 2FA code
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get all P2P orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order

### Trades
- `POST /api/trades` - Initiate trade
- `GET /api/trades/:id` - Get trade details
- `PUT /api/trades/:id/confirm` - Confirm payment
- `PUT /api/trades/:id/release` - Release crypto

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status` - Get KYC status

### Bybit Integration
- `GET /api/bybit/orders` - Fetch Bybit P2P orders
- `GET /api/bybit/prices` - Get current crypto prices

## WebSocket Events

### Client → Server
- `order:subscribe` - Subscribe to order updates
- `chat:send` - Send chat message
- `trade:update` - Update trade status

### Server → Client
- `order:new` - New order created
- `order:update` - Order updated
- `chat:message` - New chat message
- `trade:status` - Trade status changed
- `notification` - General notification

## Security Features

- JWT authentication with refresh tokens
- 2FA (TOTP) support
- Rate limiting
- Input validation and sanitization
- XSS protection
- CSRF protection
- Encrypted sensitive data
- KYC verification required for trading

## Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build frontend:
```bash
cd client
npm run build
```

2. Deploy to hosting (Vercel, Netlify, etc.)

3. Deploy backend to VPS or cloud platform

## License

MIT License

## Support

For support, email support@p2ptrading.com or join our Telegram group.
