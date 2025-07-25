# Event Service

## Overview
The Event Service is the core microservice for event management in the Festive Event Management Platform. It handles event creation, management, analytics, schedules, attachments, payments, deliverables, and activity logging.

## Architecture

### Core Components
- **Express.js** with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT Authentication** middleware
- **File upload** handling with multer
- **Analytics** and reporting capabilities

### Service Structure
```
src/
├── controllers/
│   ├── eventController.ts       # Event CRUD operations
│   ├── vendorController.ts      # Event vendor management
│   ├── scheduleController.ts    # Event scheduling
│   ├── attachmentController.ts  # File attachments
│   ├── paymentController.ts     # Payment tracking
│   ├── deliverableController.ts # Deliverable management
│   ├── activityLogController.ts # Activity logging
│   └── analyticsController.ts   # Analytics and reporting
├── middleware/
│   └── auth.ts                 # JWT authentication
├── routes/
│   ├── event.ts                # Event routes
│   ├── vendor.ts               # Vendor routes
│   ├── schedule.ts             # Schedule routes
│   ├── attachment.ts           # Attachment routes
│   ├── payment.ts              # Payment routes
│   ├── deliverable.ts          # Deliverable routes
│   ├── activityLog.ts          # Activity log routes
│   └── analytics.ts            # Analytics routes
├── types/
│   ├── event.ts                # Event type definitions
│   ├── vendor.ts               # Vendor type definitions
│   ├── schedule.ts             # Schedule type definitions
│   ├── attachment.ts           # Attachment type definitions
│   ├── payment.ts              # Payment type definitions
│   ├── deliverable.ts          # Deliverable type definitions
│   ├── section.ts              # Section type definitions
│   └── vendor.ts               # Vendor type definitions
└── app.ts                      # Express application setup
```

## Database Schema

### Core Models
- **Event**: Main event entity with all event details
- **Section**: Event sections for organizing event components
- **SectionItem**: Individual items within sections
- **Vendor**: Vendor information and relationships
- **EventVendor**: Many-to-many relationship between events and vendors
- **Schedule**: Event scheduling and timeline management
- **Attachment**: File attachments for events
- **Payment**: Payment tracking for events
- **Deliverable**: Deliverable items from vendors
- **ActivityLog**: Activity tracking and audit logs

### Key Relationships
- Events have multiple vendors (many-to-many)
- Events have multiple sections with items
- Events have multiple schedules, payments, and deliverables
- Vendors can be associated with multiple events
- All activities are logged for audit purposes

## API Endpoints

### Event Management

#### POST `/events`
Create a new event.

**Request Body:**
```json
{
  "name": "Summer Wedding",
  "description": "Outdoor wedding ceremony and reception",
  "eventType": "wedding",
  "eventDate": "2024-08-15T18:00:00Z",
  "currency": "USD",
  "budget": 25000,
  "phoneNumber": "+1234567890",
  "projectManager": "John Doe"
}
```

**Response:**
```json
{
  "id": "event-uuid",
  "name": "Summer Wedding",
  "description": "Outdoor wedding ceremony and reception",
  "eventType": "wedding",
  "eventDate": "2024-08-15T18:00:00Z",
  "currency": "USD",
  "budget": 25000,
  "phoneNumber": "+1234567890",
  "projectManager": "John Doe",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### GET `/events`
List all events with optional filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for event name/description
- `eventType`: Filter by event type
- `dateFrom`: Filter events from date
- `dateTo`: Filter events to date

#### GET `/events/:id`
Get specific event details with all related data.

#### PUT `/events/:id`
Update event information.

#### DELETE `/events/:id`
Delete an event and all related data.

### Vendor Management

#### POST `/events/:eventId/vendors`
Add a vendor to an event.

**Request Body:**
```json
{
  "vendorId": "vendor-uuid",
  "price": 5000,
  "amount": 5000,
  "paymentStatus": "pending"
}
```

#### GET `/events/:eventId/vendors`
List all vendors for an event.

#### PUT `/events/:eventId/vendors/:vendorId`
Update vendor information for an event.

#### DELETE `/events/:eventId/vendors/:vendorId`
Remove a vendor from an event.

### Schedule Management

#### POST `/events/:eventId/schedules`
Create a new schedule item.

**Request Body:**
```json
{
  "forType": "vendor",
  "forId": "vendor-uuid",
  "description": "Setup and decoration",
  "date": "2024-08-15T14:00:00Z",
  "status": "pending"
}
```

#### GET `/events/:eventId/schedules`
List all schedules for an event.

#### PUT `/events/:eventId/schedules/:id`
Update schedule information.

#### DELETE `/events/:eventId/schedules/:id`
Delete a schedule item.

### Attachment Management

#### POST `/events/:eventId/attachments`
Upload a file attachment.

**Request Body:** (multipart/form-data)
- `file`: The file to upload
- `name`: File name
- `description`: File description

#### GET `/events/:eventId/attachments`
List all attachments for an event.

#### DELETE `/events/:eventId/attachments/:id`
Delete an attachment.

#### POST `/events/:eventId/attachments/upload`
Upload file and get URL (for use with other endpoints).

### Payment Management

#### POST `/events/:eventId/payments`
Add a payment record.

**Request Body:**
```json
{
  "amount": 2500,
  "paidAt": "2024-01-15T10:00:00Z"
}
```

#### GET `/events/:eventId/payments`
List all payments for an event.

#### PUT `/events/:eventId/payments/:id`
Update payment information.

#### DELETE `/events/:eventId/payments/:id`
Delete a payment record.

### Deliverable Management

#### POST `/events/:eventId/deliverables`
Create a new deliverable.

**Request Body:**
```json
{
  "vendorId": "vendor-uuid",
  "name": "Wedding Photography",
  "description": "Complete wedding photography package",
  "date": "2024-08-15T20:00:00Z",
  "status": "pending"
}
```

#### GET `/events/:eventId/deliverables`
List all deliverables for an event.

#### PUT `/events/:eventId/deliverables/:id`
Update deliverable information.

#### DELETE `/events/:eventId/deliverables/:id`
Delete a deliverable.

### Section Management

#### POST `/events/:eventId/sections`
Create a new event section.

**Request Body:**
```json
{
  "name": "Ceremony",
  "items": [
    {
      "name": "Officiant",
      "status": "confirmed",
      "description": "Wedding officiant",
      "phone": "+1234567890",
      "email": "officiant@example.com"
    }
  ]
}
```

#### GET `/events/:eventId/sections`
List all sections for an event.

#### PUT `/events/:eventId/sections/:id`
Update section information.

#### DELETE `/events/:eventId/sections/:id`
Delete a section.

### Analytics

#### GET `/events/:eventId/analytics`
Get comprehensive analytics for a specific event.

**Response:**
```json
{
  "event": {
    "id": "event-uuid",
    "name": "Summer Wedding",
    "eventDate": "2024-08-15T18:00:00Z"
  },
  "countdown": 45,
  "budget": {
    "total": 25000,
    "spent": 15000,
    "remaining": 10000
  },
  "vendors": {
    "total": 8,
    "confirmed": 6,
    "pending": 2
  },
  "deliverables": {
    "total": 12,
    "completed": 8,
    "pending": 4
  },
  "schedules": {
    "total": 15,
    "completed": 10,
    "upcoming": 5
  },
  "attachments": {
    "total": 25
  }
}
```

#### GET `/events/analytics`
Get global analytics across all events.

**Response:**
```json
{
  "totalEvents": 45,
  "totalUpcomingEvents": 12,
  "totalBudgets": 1250000,
  "totalClientPayments": 850000,
  "totalOutstanding": 400000,
  "allUpcomingSchedules": [...],
  "allUpcomingSchedulesCount": 67
}
```

### Activity Logging

#### GET `/events/:eventId/activity-logs`
Get activity logs for an event.

**Query Parameters:**
- `status`: Filter by activity status
- `action`: Filter by action type

#### POST `/events/:eventId/activity-logs`
Create a new activity log entry.

**Request Body:**
```json
{
  "action": "vendor_added",
  "details": "Added photographer vendor",
  "status": "completed"
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgres://festive:festivepass@postgres:5432/festive_db
JWT_SECRET=your-very-strong-secret
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
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
docker-compose up --build event
```

## Testing

### Health Check
```bash
curl http://localhost:3002/health
```

### Test Event Creation
```bash
curl -X POST http://localhost:3002/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Test Event",
    "description": "Test event description",
    "eventType": "corporate",
    "eventDate": "2024-12-25T18:00:00Z",
    "currency": "USD",
    "budget": 10000
  }'
```

## File Upload

### Supported File Types
- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Presentations: PPT, PPTX
- Archives: ZIP, RAR

### File Storage
- **Local Storage**: Files stored in `./uploads` directory
- **S3 Integration**: Ready for AWS S3 integration (commented code)
- **File Size Limit**: 10MB per file
- **File Naming**: UUID-based naming for security

## Analytics Features

### Event Analytics
- **Countdown**: Days until event
- **Budget Tracking**: Total, spent, remaining amounts
- **Vendor Status**: Confirmed vs pending vendors
- **Deliverable Progress**: Completion tracking
- **Schedule Overview**: Timeline management
- **Attachment Count**: File organization

### Global Analytics
- **Event Statistics**: Total and upcoming events
- **Financial Overview**: Budgets, payments, outstanding amounts
- **Schedule Management**: Upcoming schedules across all events
- **Performance Metrics**: Event completion rates

## Security Features

- **JWT Authentication**: All endpoints require valid JWT
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: File type and size validation
- **SQL Injection Protection**: Prisma ORM protection
- **Error Handling**: Secure error responses
- **Activity Logging**: Complete audit trail

## Integration with Other Services

The Event Service integrates with:
- **Auth Service**: User authentication and permissions
- **Vendor Service**: Global vendor management
- **Invoice Service**: Invoice generation and tracking
- **API Gateway**: Centralized routing and aggregation

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large dataset handling
- **File Upload**: Streaming uploads for large files
- **Caching**: Ready for Redis integration
- **Connection Pooling**: Database connection optimization 