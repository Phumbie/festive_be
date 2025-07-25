# Vendor Service

## Overview
The Vendor Service is a dedicated microservice for managing global vendors in the Festive Event Management Platform. It handles vendor creation, management, analytics, and provides vendor data to other services.

## Architecture

### Core Components
- **Express.js** with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT Authentication** middleware
- **Analytics** and reporting capabilities

### Service Structure
```
src/
├── controllers/
│   ├── vendorController.ts      # Vendor CRUD operations
│   └── analyticsController.ts   # Vendor analytics
├── middleware/
│   └── auth.ts                 # JWT authentication
├── routes/
│   ├── vendor.ts               # Vendor routes
│   └── analytics.ts            # Analytics routes
├── types/
│   └── vendor.ts               # Vendor type definitions
└── app.ts                      # Express application setup
```

## Database Schema

### Core Models
- **Vendor**: Global vendor information and details
- **VendorEvent**: Many-to-many relationship between vendors and events

### Key Relationships
- Vendors can be associated with multiple events
- Each vendor-event relationship includes pricing and payment status
- Vendors have an owner (user who created them)

## API Endpoints

### Vendor Management

#### POST `/vendors`
Create a new global vendor.

**Request Body:**
```json
{
  "name": "Elite Photography",
  "description": "Professional wedding and event photography services",
  "phoneNumber": "+1234567890",
  "email": "contact@elitephotography.com",
  "address": "123 Main St, City, State 12345"
}
```

**Response:**
```json
{
  "id": "vendor-uuid",
  "name": "Elite Photography",
  "description": "Professional wedding and event photography services",
  "phoneNumber": "+1234567890",
  "email": "contact@elitephotography.com",
  "address": "123 Main St, City, State 12345",
  "ownerId": "user-uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### GET `/vendors`
List all vendors with optional filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for vendor name/description
- `ownerId`: Filter by vendor owner
- `sortBy`: Sort field (name, createdAt, updatedAt)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "vendors": [
    {
      "id": "vendor-uuid",
      "name": "Elite Photography",
      "description": "Professional wedding and event photography services",
      "phoneNumber": "+1234567890",
      "email": "contact@elitephotography.com",
      "address": "123 Main St, City, State 12345",
      "ownerId": "user-uuid",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "vendorEvents": [
        {
          "id": "vendor-event-uuid",
          "eventId": "event-uuid",
          "price": 5000,
          "amount": 5000,
          "paymentStatus": "pending",
          "createdAt": "2024-01-15T10:00:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET `/vendors/:id`
Get specific vendor details with event relationships.

**Response:**
```json
{
  "id": "vendor-uuid",
  "name": "Elite Photography",
  "description": "Professional wedding and event photography services",
  "phoneNumber": "+1234567890",
  "email": "contact@elitephotography.com",
  "address": "123 Main St, City, State 12345",
  "ownerId": "user-uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "vendorEvents": [
    {
      "id": "vendor-event-uuid",
      "eventId": "event-uuid",
      "price": 5000,
      "amount": 5000,
      "paymentStatus": "pending",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### PUT `/vendors/:id`
Update vendor information.

**Request Body:**
```json
{
  "name": "Elite Photography Studio",
  "description": "Updated description",
  "phoneNumber": "+1234567890",
  "email": "info@elitephotography.com",
  "address": "456 Oak Ave, City, State 12345"
}
```

#### DELETE `/vendors/:id`
Delete a vendor (only if not associated with any events).

### Vendor Event Relationships

#### POST `/vendors/:vendorId/events`
Associate a vendor with an event.

**Request Body:**
```json
{
  "eventId": "event-uuid",
  "price": 5000,
  "amount": 5000,
  "paymentStatus": "pending"
}
```

#### GET `/vendors/:vendorId/events`
List all events associated with a vendor.

#### PUT `/vendors/:vendorId/events/:eventId`
Update vendor-event relationship.

**Request Body:**
```json
{
  "price": 5500,
  "amount": 3000,
  "paymentStatus": "partial"
}
```

#### DELETE `/vendors/:vendorId/events/:eventId`
Remove vendor from an event.

### Analytics

#### GET `/vendors/analytics`
Get comprehensive vendor analytics.

**Response:**
```json
{
  "totalVendors": 45,
  "activeVendors": 38,
  "totalRevenue": 125000,
  "averageVendorRating": 4.2,
  "topVendors": [
    {
      "id": "vendor-uuid",
      "name": "Elite Photography",
      "totalEvents": 15,
      "totalRevenue": 75000,
      "averageRating": 4.8
    }
  ],
  "vendorCategories": {
    "photography": 12,
    "catering": 8,
    "decoration": 10,
    "music": 6,
    "transportation": 4,
    "other": 5
  },
  "recentActivity": [
    {
      "vendorId": "vendor-uuid",
      "vendorName": "Elite Photography",
      "action": "added_to_event",
      "eventId": "event-uuid",
      "eventName": "Summer Wedding",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### GET `/vendors/:id/analytics`
Get analytics for a specific vendor.

**Response:**
```json
{
  "vendor": {
    "id": "vendor-uuid",
    "name": "Elite Photography",
    "description": "Professional wedding and event photography services"
  },
  "statistics": {
    "totalEvents": 15,
    "completedEvents": 12,
    "upcomingEvents": 3,
    "totalRevenue": 75000,
    "averageRating": 4.8,
    "totalDeliverables": 45,
    "completedDeliverables": 42
  },
  "recentEvents": [
    {
      "eventId": "event-uuid",
      "eventName": "Summer Wedding",
      "eventDate": "2024-08-15T18:00:00Z",
      "price": 5000,
      "paymentStatus": "paid",
      "deliverables": 3,
      "completedDeliverables": 3
    }
  ],
  "performance": {
    "onTimeDelivery": 95,
    "customerSatisfaction": 4.8,
    "repeatBookings": 8
  }
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3003
DATABASE_URL=postgres://festive:festivepass@postgres:5432/festive_db
JWT_SECRET=your-very-strong-secret
```

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Local Development
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build vendor
```

## Testing

### Health Check
```bash
curl http://localhost:3003/health
```

### Test Vendor Creation
```bash
curl -X POST http://localhost:3003/vendors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Test Vendor",
    "description": "Test vendor description",
    "phoneNumber": "+1234567890",
    "email": "test@vendor.com",
    "address": "123 Test St, Test City, TS 12345"
  }'
```

## Vendor Categories

### Supported Categories
- **Photography**: Wedding and event photographers
- **Catering**: Food and beverage services
- **Decoration**: Event decoration and floral services
- **Music**: DJs, bands, and entertainment
- **Transportation**: Limousine and transportation services
- **Venue**: Event venues and locations
- **Other**: Miscellaneous services

### Vendor Status
- **Active**: Currently available for bookings
- **Inactive**: Temporarily unavailable
- **Suspended**: Account suspended
- **Deleted**: Removed from system

## Analytics Features

### Global Analytics
- **Vendor Statistics**: Total, active, and performance metrics
- **Revenue Tracking**: Total revenue and average earnings
- **Category Analysis**: Distribution across vendor categories
- **Performance Metrics**: Ratings, delivery times, satisfaction scores
- **Activity Monitoring**: Recent vendor activities and events

### Vendor-Specific Analytics
- **Event History**: Complete list of associated events
- **Revenue Analysis**: Earnings breakdown and trends
- **Performance Metrics**: Delivery times, customer satisfaction
- **Deliverable Tracking**: Completion rates and quality metrics
- **Repeat Business**: Customer retention and loyalty metrics

## Security Features

- **JWT Authentication**: All endpoints require valid JWT
- **Owner-based Access**: Vendors can only be managed by their owners
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM protection
- **Error Handling**: Secure error responses
- **Data Privacy**: Sensitive vendor information protection

## Integration with Other Services

The Vendor Service integrates with:
- **Auth Service**: User authentication and ownership
- **Event Service**: Vendor-event relationships and deliverables
- **Invoice Service**: Invoice generation for vendor services
- **API Gateway**: Centralized routing and aggregation

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large dataset handling
- **Caching**: Ready for Redis integration
- **Connection Pooling**: Database connection optimization
- **Search Optimization**: Full-text search capabilities

## Data Models

### Vendor Model
```typescript
interface Vendor {
  id: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
  vendorEvents: VendorEvent[];
}
```

### VendorEvent Model
```typescript
interface VendorEvent {
  id: string;
  vendorId: string;
  eventId: string;
  price?: number;
  amount?: number;
  paymentStatus?: string;
  createdAt: Date;
}
```

## Error Handling

### Common Error Responses
```json
{
  "error": "Vendor not found",
  "statusCode": 404
}
```

```json
{
  "error": "Cannot delete vendor with active events",
  "statusCode": 400,
  "activeEvents": 3
}
```

```json
{
  "error": "Unauthorized access",
  "statusCode": 403
}
```

## Best Practices

### Vendor Management
- Always validate vendor information before creation
- Implement proper search and filtering
- Maintain vendor history and audit trails
- Provide comprehensive analytics and reporting
- Ensure data privacy and security

### Performance
- Use pagination for large vendor lists
- Implement caching for frequently accessed data
- Optimize database queries with proper indexing
- Monitor service performance and metrics 