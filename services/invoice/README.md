# Invoice Service

## Overview
The Invoice Service is a dedicated microservice for managing invoices in the Festive Event Management Platform. It handles invoice creation, management, status tracking, and provides comprehensive invoice data to other services.

## Architecture

### Core Components
- **Express.js** with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT Authentication** middleware
- **Invoice generation** and management capabilities

### Service Structure
```
src/
├── controllers/
│   └── invoiceController.ts     # Invoice CRUD operations
├── middleware/
│   └── auth.ts                 # JWT authentication
├── routes/
│   └── invoice.ts              # Invoice routes
├── types/
│   └── invoice.ts              # Invoice type definitions
└── app.ts                      # Express application setup
```

## Database Schema

### Core Models
- **Invoice**: Main invoice entity with all invoice details
- **InvoiceItem**: Individual line items within invoices

### Key Relationships
- Invoices can have multiple line items
- Each invoice is associated with an event
- Invoice items can be linked to vendors or services

## API Endpoints

### Invoice Management

#### POST `/invoices`
Create a new invoice.

**Request Body:**
```json
{
  "eventId": "event-uuid",
  "clientName": "John & Jane Doe",
  "clientEmail": "john.doe@example.com",
  "clientPhone": "+1234567890",
  "clientAddress": "123 Main St, City, State 12345",
  "invoiceNumber": "INV-2024-001",
  "date": "2024-01-15T10:00:00Z",
  "dueDate": "2024-02-15T10:00:00Z",
  "currency": "USD",
  "status": "draft",
  "notes": "Payment due within 30 days",
  "items": [
    {
      "name": "Wedding Photography Package",
      "description": "Complete wedding photography including ceremony and reception",
      "quantity": 1,
      "unitPrice": 2500,
      "amount": 2500
    },
    {
      "name": "Wedding Catering",
      "description": "Full catering service for 100 guests",
      "quantity": 1,
      "unitPrice": 5000,
      "amount": 5000
    }
  ]
}
```

**Response:**
```json
{
  "id": "invoice-uuid",
  "eventId": "event-uuid",
  "clientName": "John & Jane Doe",
  "clientEmail": "john.doe@example.com",
  "clientPhone": "+1234567890",
  "clientAddress": "123 Main St, City, State 12345",
  "invoiceNumber": "INV-2024-001",
  "date": "2024-01-15T10:00:00Z",
  "dueDate": "2024-02-15T10:00:00Z",
  "currency": "USD",
  "status": "draft",
  "notes": "Payment due within 30 days",
  "subtotal": 7500,
  "tax": 750,
  "total": 8250,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "items": [
    {
      "id": "item-uuid",
      "name": "Wedding Photography Package",
      "description": "Complete wedding photography including ceremony and reception",
      "quantity": 1,
      "unitPrice": 2500,
      "amount": 2500
    },
    {
      "id": "item-uuid-2",
      "name": "Wedding Catering",
      "description": "Full catering service for 100 guests",
      "quantity": 1,
      "unitPrice": 5000,
      "amount": 5000
    }
  ]
}
```

#### GET `/invoices`
List all invoices with optional filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for client name/invoice number
- `status`: Filter by invoice status (draft, sent, paid, overdue, cancelled)
- `dateFrom`: Filter invoices from date
- `dateTo`: Filter invoices to date
- `eventId`: Filter by specific event
- `sortBy`: Sort field (date, dueDate, total, status)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "invoices": [
    {
      "id": "invoice-uuid",
      "eventId": "event-uuid",
      "clientName": "John & Jane Doe",
      "clientEmail": "john.doe@example.com",
      "invoiceNumber": "INV-2024-001",
      "date": "2024-01-15T10:00:00Z",
      "dueDate": "2024-02-15T10:00:00Z",
      "currency": "USD",
      "status": "sent",
      "subtotal": 7500,
      "tax": 750,
      "total": 8250,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "summary": {
    "totalInvoices": 25,
    "totalAmount": 125000,
    "paidAmount": 85000,
    "outstandingAmount": 40000,
    "overdueAmount": 15000
  }
}
```

#### GET `/invoices/:id`
Get specific invoice details with all line items.

**Response:**
```json
{
  "id": "invoice-uuid",
  "eventId": "event-uuid",
  "clientName": "John & Jane Doe",
  "clientEmail": "john.doe@example.com",
  "clientPhone": "+1234567890",
  "clientAddress": "123 Main St, City, State 12345",
  "invoiceNumber": "INV-2024-001",
  "date": "2024-01-15T10:00:00Z",
  "dueDate": "2024-02-15T10:00:00Z",
  "currency": "USD",
  "status": "sent",
  "notes": "Payment due within 30 days",
  "subtotal": 7500,
  "tax": 750,
  "total": 8250,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "items": [
    {
      "id": "item-uuid",
      "name": "Wedding Photography Package",
      "description": "Complete wedding photography including ceremony and reception",
      "quantity": 1,
      "unitPrice": 2500,
      "amount": 2500
    },
    {
      "id": "item-uuid-2",
      "name": "Wedding Catering",
      "description": "Full catering service for 100 guests",
      "quantity": 1,
      "unitPrice": 5000,
      "amount": 5000
    }
  ]
}
```

#### PUT `/invoices/:id`
Update invoice information.

**Request Body:**
```json
{
  "clientName": "John & Jane Doe Updated",
  "clientEmail": "john.doe.updated@example.com",
  "status": "paid",
  "notes": "Payment received on 2024-01-20",
  "items": {
    "update": [
      {
        "where": { "id": "item-uuid" },
        "data": { "unitPrice": 2600, "amount": 2600 }
      }
    ],
    "create": [
      {
        "name": "Additional Services",
        "description": "Extra decoration services",
        "quantity": 1,
        "unitPrice": 500,
        "amount": 500
      }
    ]
  }
}
```

#### DELETE `/invoices/:id`
Delete an invoice (only if status is draft).

### Invoice Item Management

#### POST `/invoices/:invoiceId/items`
Add a new line item to an invoice.

**Request Body:**
```json
{
  "name": "Wedding DJ Services",
  "description": "DJ for ceremony and reception",
  "quantity": 1,
  "unitPrice": 800,
  "amount": 800
}
```

#### GET `/invoices/:invoiceId/items`
List all line items for an invoice.

#### PUT `/invoices/:invoiceId/items/:itemId`
Update a specific line item.

**Request Body:**
```json
{
  "name": "Wedding DJ Services Updated",
  "description": "DJ for ceremony and reception with lighting",
  "quantity": 1,
  "unitPrice": 900,
  "amount": 900
}
```

#### DELETE `/invoices/:invoiceId/items/:itemId`
Delete a line item from an invoice.

### Invoice Status Management

#### PUT `/invoices/:id/status`
Update invoice status.

**Request Body:**
```json
{
  "status": "paid",
  "paymentDate": "2024-01-20T10:00:00Z",
  "paymentMethod": "bank_transfer",
  "notes": "Payment received via bank transfer"
}
```

**Available Statuses:**
- `draft`: Invoice is being prepared
- `sent`: Invoice has been sent to client
- `paid`: Invoice has been paid
- `overdue`: Invoice is past due date
- `cancelled`: Invoice has been cancelled

### Invoice Analytics

#### GET `/invoices/analytics`
Get comprehensive invoice analytics.

**Response:**
```json
{
  "summary": {
    "totalInvoices": 150,
    "totalAmount": 1250000,
    "paidAmount": 850000,
    "outstandingAmount": 400000,
    "overdueAmount": 150000,
    "averageInvoiceAmount": 8333.33
  },
  "statusBreakdown": {
    "draft": 10,
    "sent": 25,
    "paid": 100,
    "overdue": 12,
    "cancelled": 3
  },
  "monthlyTrends": [
    {
      "month": "2024-01",
      "invoices": 25,
      "amount": 125000,
      "paid": 85000
    },
    {
      "month": "2024-02",
      "invoices": 30,
      "amount": 150000,
      "paid": 120000
    }
  ],
  "topClients": [
    {
      "clientName": "John & Jane Doe",
      "totalInvoices": 5,
      "totalAmount": 25000,
      "paidAmount": 20000
    }
  ],
  "recentActivity": [
    {
      "invoiceId": "invoice-uuid",
      "invoiceNumber": "INV-2024-001",
      "action": "status_updated",
      "oldStatus": "sent",
      "newStatus": "paid",
      "timestamp": "2024-01-20T10:00:00Z"
    }
  ]
}
```

#### GET `/invoices/:id/analytics`
Get analytics for a specific invoice.

**Response:**
```json
{
  "invoice": {
    "id": "invoice-uuid",
    "invoiceNumber": "INV-2024-001",
    "clientName": "John & Jane Doe",
    "status": "paid",
    "total": 8250
  },
  "paymentHistory": [
    {
      "date": "2024-01-20T10:00:00Z",
      "amount": 8250,
      "method": "bank_transfer",
      "status": "completed"
    }
  ],
  "timeline": [
    {
      "date": "2024-01-15T10:00:00Z",
      "action": "created",
      "description": "Invoice created"
    },
    {
      "date": "2024-01-16T10:00:00Z",
      "action": "sent",
      "description": "Invoice sent to client"
    },
    {
      "date": "2024-01-20T10:00:00Z",
      "action": "paid",
      "description": "Payment received"
    }
  ]
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3004
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
docker-compose up --build invoice
```

## Testing

### Health Check
```bash
curl http://localhost:3004/health
```

### Test Invoice Creation
```bash
curl -X POST http://localhost:3004/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "eventId": "event-uuid",
    "clientName": "Test Client",
    "clientEmail": "test@client.com",
    "invoiceNumber": "INV-2024-001",
    "date": "2024-01-15T10:00:00Z",
    "dueDate": "2024-02-15T10:00:00Z",
    "currency": "USD",
    "status": "draft",
    "items": [
      {
        "name": "Test Service",
        "description": "Test service description",
        "quantity": 1,
        "unitPrice": 1000,
        "amount": 1000
      }
    ]
  }'
```

## Invoice Features

### Invoice Statuses
- **Draft**: Invoice is being prepared and can be modified
- **Sent**: Invoice has been sent to client and is awaiting payment
- **Paid**: Invoice has been fully paid
- **Overdue**: Invoice is past the due date
- **Cancelled**: Invoice has been cancelled

### Payment Methods
- **Bank Transfer**: Direct bank transfer
- **Credit Card**: Credit card payment
- **Cash**: Cash payment
- **Check**: Check payment
- **Online Payment**: Online payment gateway

### Invoice Numbering
- **Format**: INV-YYYY-NNNN (e.g., INV-2024-0001)
- **Auto-increment**: Automatic numbering system
- **Custom**: Support for custom invoice numbers

## Analytics Features

### Financial Analytics
- **Revenue Tracking**: Total invoiced amounts and payments
- **Outstanding Balances**: Unpaid invoice amounts
- **Payment Trends**: Monthly and yearly payment patterns
- **Client Analysis**: Top clients by revenue
- **Overdue Tracking**: Overdue invoice monitoring

### Operational Analytics
- **Invoice Volume**: Number of invoices by period
- **Average Invoice Amount**: Statistical analysis
- **Payment Speed**: Average time to payment
- **Status Distribution**: Breakdown by invoice status
- **Activity Monitoring**: Recent invoice activities

## Security Features

- **JWT Authentication**: All endpoints require valid JWT
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM protection
- **Error Handling**: Secure error responses
- **Data Privacy**: Sensitive client information protection
- **Audit Trail**: Complete invoice activity logging

## Integration with Other Services

The Invoice Service integrates with:
- **Auth Service**: User authentication and permissions
- **Event Service**: Event-based invoice generation
- **Vendor Service**: Vendor service invoicing
- **API Gateway**: Centralized routing and aggregation

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large dataset handling
- **Caching**: Ready for Redis integration
- **Connection Pooling**: Database connection optimization
- **Search Optimization**: Full-text search capabilities

## Data Models

### Invoice Model
```typescript
interface Invoice {
  id: string;
  eventId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: InvoiceItem[];
}
```

### InvoiceItem Model
```typescript
interface InvoiceItem {
  id: string;
  invoiceId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
```

## Error Handling

### Common Error Responses
```json
{
  "error": "Invoice not found",
  "statusCode": 404
}
```

```json
{
  "error": "Cannot delete paid invoice",
  "statusCode": 400,
  "currentStatus": "paid"
}
```

```json
{
  "error": "Invalid invoice status transition",
  "statusCode": 400,
  "currentStatus": "paid",
  "requestedStatus": "draft"
}
```

## Best Practices

### Invoice Management
- Always validate invoice data before creation
- Implement proper status transitions
- Maintain complete audit trails
- Provide comprehensive analytics
- Ensure data accuracy and consistency

### Performance
- Use pagination for large invoice lists
- Implement caching for frequently accessed data
- Optimize database queries with proper indexing
- Monitor service performance and metrics
- Implement efficient search capabilities 