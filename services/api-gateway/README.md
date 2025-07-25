# API Gateway Service

## Overview
The API Gateway Service is the central entry point for the Festive Event Management Platform. It provides unified access to all microservices, handles routing, authentication, and aggregates data for comprehensive dashboard views.

## Architecture

### Core Components
- **Express.js** with TypeScript
- **http-proxy-middleware** for service routing
- **JWT Authentication** middleware
- **Data aggregation** capabilities
- **Rate limiting** and security features

### Service Structure
```
src/
├── controllers/
│   └── dashboardController.ts   # Dashboard data aggregation
├── routes/
│   └── dashboard.ts            # Dashboard routes
├── middleware/
│   ├── auth.ts                 # JWT authentication
│   ├── rateLimit.ts            # Rate limiting
│   └── cors.ts                 # CORS handling
└── app.ts                      # Express application setup
```

## Service Integration

### Microservice Routing
The API Gateway routes requests to the appropriate microservices:

- **Auth Service** (`http://auth:3001`): Authentication and user management
- **Event Service** (`http://event:3002`): Event management and analytics
- **Vendor Service** (`http://vendor:3003`): Vendor management
- **Invoice Service** (`http://invoice:3004`): Invoice management

### Proxy Configuration
```typescript
// Auth Service Routes
app.use('/api/auth', createProxyMiddleware({ 
  target: AUTH_SERVICE_URL, 
  changeOrigin: true, 
  pathRewrite: { '^/api/auth': '' } 
}));

// Event Service Routes
app.use('/api/events', createProxyMiddleware({ 
  target: EVENT_SERVICE_URL, 
  changeOrigin: true, 
  pathRewrite: { '^/api/events': '' } 
}));

// Vendor Service Routes
app.use('/api/vendors', createProxyMiddleware({ 
  target: VENDOR_SERVICE_URL, 
  changeOrigin: true, 
  pathRewrite: { '^/api/vendors': '' } 
}));

// Invoice Service Routes
app.use('/api/invoices', createProxyMiddleware({ 
  target: INVOICE_SERVICE_URL, 
  changeOrigin: true, 
  pathRewrite: { '^/api/invoices': '' } 
}));
```

## API Endpoints

### Dashboard Aggregation

#### GET `/api/dashboard`
Get comprehensive dashboard data aggregated from all services.

**Response:**
```json
{
  "financialMetrics": {
    "totalClientPayments": 850000,
    "totalBudgets": 1250000,
    "totalOutstanding": 400000
  },
  "eventMetrics": {
    "totalEvents": 45,
    "totalUpcomingEvents": 12
  },
  "businessMetrics": {
    "totalInvoicesSent": 150,
    "totalVendors": 38
  },
  "scheduleMetrics": {
    "allUpcomingSchedules": [
      {
        "id": "schedule-uuid",
        "eventId": "event-uuid",
        "eventName": "Summer Wedding",
        "description": "Setup and decoration",
        "date": "2024-08-15T14:00:00Z",
        "status": "pending"
      }
    ],
    "allUpcomingSchedulesCount": 67
  },
  "recentActivity": [
    {
      "service": "events",
      "action": "event_created",
      "description": "New event 'Summer Wedding' created",
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "service": "invoices",
      "action": "invoice_paid",
      "description": "Invoice INV-2024-001 marked as paid",
      "timestamp": "2024-01-14T15:30:00Z"
    }
  ]
}
```

### Health Check

#### GET `/health`
Check the health status of the API Gateway.

**Response:**
```json
{
  "status": "ok",
  "service": "api-gateway",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": "2h 30m 15s"
}
```

## Service-Specific Endpoints

### Authentication Endpoints
All auth-related requests are proxied to the Auth Service:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Email verification
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/roles` - Role management
- `GET /api/auth/users` - User management
- `GET /api/auth/permissions` - Permission management

### Event Management Endpoints
All event-related requests are proxied to the Event Service:

- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/analytics` - Event analytics
- `GET /api/events/analytics` - Global analytics

### Vendor Management Endpoints
All vendor-related requests are proxied to the Vendor Service:

- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor
- `GET /api/vendors/:id` - Get vendor details
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor
- `GET /api/vendors/analytics` - Vendor analytics

### Invoice Management Endpoints
All invoice-related requests are proxied to the Invoice Service:

- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/analytics` - Invoice analytics

## Environment Variables

```env
NODE_ENV=development
PORT=3000
AUTH_SERVICE_URL=http://auth:3001
EVENT_SERVICE_URL=http://event:3002
VENDOR_SERVICE_URL=http://vendor:3003
INVOICE_SERVICE_URL=http://invoice:3004
API_GATEWAY_PORT=3000
DATABASE_URL=postgres://festive:festivepass@postgres:5432/festive_db
JWT_SECRET=your-very-strong-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

## Development

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- All microservices running

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build api-gateway
```

## Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Test Dashboard
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <jwt-token>"
```

### Test Service Proxying
```bash
# Test auth service
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Test event service
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer <jwt-token>"
```

## Dashboard Aggregation Features

### Data Sources
The dashboard aggregates data from multiple services:

- **Event Service**: Event statistics, budgets, payments
- **Vendor Service**: Vendor counts and analytics
- **Invoice Service**: Invoice statistics and financial data
- **Auth Service**: User activity and permissions

### Aggregation Logic
```typescript
// Fetch data from all services in parallel
const [eventRes, vendorRes, invoiceRes] = await Promise.all([
  fetch(`${EVENT_SERVICE_URL}/events/analytics`),
  fetch(`${VENDOR_SERVICE_URL}/vendors/analytics`),
  fetch(`${INVOICE_SERVICE_URL}/invoices`),
]);

// Aggregate dashboard data
const dashboardData = {
  financialMetrics: {
    totalClientPayments: eventAnalytics.totalClientPayments || 0,
    totalBudgets: eventAnalytics.totalBudgets || 0,
    totalOutstanding: eventAnalytics.totalOutstanding || 0,
  },
  eventMetrics: {
    totalEvents: eventAnalytics.totalEvents || 0,
    totalUpcomingEvents: eventAnalytics.totalUpcomingEvents || 0,
  },
  businessMetrics: {
    totalInvoicesSent: Array.isArray(invoices) ? invoices.length : 0,
    totalVendors: vendorAnalytics.totalVendors || 0,
  },
  scheduleMetrics: {
    allUpcomingSchedules: eventAnalytics.allUpcomingSchedules || [],
    allUpcomingSchedulesCount: eventAnalytics.allUpcomingSchedulesCount || 0,
  },
};
```

## Security Features

### Authentication
- **JWT Token Validation**: All protected endpoints require valid JWT
- **Token Forwarding**: JWT tokens are forwarded to microservices
- **Session Management**: Centralized session handling

### Rate Limiting
```typescript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});
```

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
```

### Error Handling
- **Service Unavailable**: When microservices are down
- **Timeout Handling**: Request timeout management
- **Circuit Breaker**: Protection against cascading failures

## Performance Considerations

### Load Balancing
- **Round Robin**: Distribute requests across service instances
- **Health Checks**: Monitor service availability
- **Failover**: Automatic failover to healthy instances

### Caching
- **Response Caching**: Cache frequently requested data
- **Dashboard Caching**: Cache aggregated dashboard data
- **Redis Integration**: Ready for Redis caching

### Monitoring
- **Request Logging**: Log all incoming requests
- **Response Times**: Monitor service response times
- **Error Tracking**: Track and alert on errors
- **Metrics Collection**: Collect performance metrics

## Error Handling

### Service Unavailable
```json
{
  "error": "Service temporarily unavailable",
  "service": "event",
  "statusCode": 503,
  "retryAfter": 30
}
```

### Authentication Error
```json
{
  "error": "Authentication required",
  "statusCode": 401
}
```

### Rate Limit Exceeded
```json
{
  "error": "Too many requests",
  "statusCode": 429,
  "retryAfter": 900
}
```

## Integration Patterns

### Request Flow
1. **Client Request**: Frontend sends request to API Gateway
2. **Authentication**: Gateway validates JWT token
3. **Routing**: Gateway routes to appropriate microservice
4. **Service Call**: Microservice processes request
5. **Response**: Gateway returns response to client

### Data Aggregation Flow
1. **Dashboard Request**: Client requests dashboard data
2. **Parallel Calls**: Gateway calls all services simultaneously
3. **Data Collection**: Collect responses from all services
4. **Aggregation**: Combine and format data
5. **Response**: Return aggregated dashboard data

## Best Practices

### Gateway Design
- **Single Entry Point**: All requests go through the gateway
- **Service Discovery**: Dynamic service discovery
- **Load Balancing**: Distribute load across services
- **Circuit Breaker**: Prevent cascading failures

### Security
- **Input Validation**: Validate all incoming requests
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS Configuration**: Proper cross-origin handling
- **Error Sanitization**: Don't expose internal errors

### Performance
- **Connection Pooling**: Reuse connections to services
- **Caching**: Cache frequently requested data
- **Compression**: Compress responses for better performance
- **Monitoring**: Comprehensive monitoring and alerting

## Deployment

### Docker Compose
```yaml
api-gateway:
  build: ./services/api-gateway
  ports:
    - '3000:3000'
  depends_on:
    - auth
    - event
    - vendor
    - invoice
  environment:
    - NODE_ENV=development
    - AUTH_SERVICE_URL=${AUTH_SERVICE_URL}
    - EVENT_SERVICE_URL=${EVENT_SERVICE_URL}
    - VENDOR_SERVICE_URL=${VENDOR_SERVICE_URL}
    - INVOICE_SERVICE_URL=${INVOICE_SERVICE_URL}
```

### Production Considerations
- **SSL/TLS**: HTTPS termination
- **Load Balancer**: Multiple gateway instances
- **Monitoring**: APM and logging
- **Backup**: Service discovery backup
- **Scaling**: Horizontal scaling capabilities 