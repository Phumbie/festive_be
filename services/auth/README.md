# Auth Service

## Overview
The Auth Service is the central authentication and authorization microservice for the Festive Event Management Platform. It handles user registration, login, role management, and permission-based access control.

## Architecture

### Core Components
- **Express.js** with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT** for stateless authentication
- **Passport.js** for Google OAuth integration
- **bcryptjs** for password hashing
- **nodemailer** for email verification

### Service Structure
```
src/
├── controllers/
│   ├── authController.ts      # Authentication logic
│   ├── roleController.ts      # Role management
│   ├── inviteController.ts    # User invitations
│   └── userManagementController.ts # User CRUD operations
├── middleware/
│   ├── auth.ts               # JWT authentication middleware
│   └── permissions.ts        # Permission-based authorization
├── routes/
│   ├── auth.ts               # Authentication routes
│   ├── role.ts               # Role management routes
│   └── userManagement.ts     # User management routes
├── passport/
│   └── google.ts             # Google OAuth strategy
├── utils/
│   └── jwt.ts                # JWT utilities
└── app.ts                    # Express application setup
```

## Database Schema

### Models
- **User**: Core user information and credentials
- **Role**: System roles with permissions
- **Permission**: Granular system permissions
- **UserRole**: Many-to-many relationship between users and roles
- **VerificationToken**: Email verification tokens

### Key Relationships
- Users can have multiple roles (many-to-many)
- Roles can have multiple permissions (many-to-many)
- Permissions are hardcoded system-wide

## API Endpoints

### Authentication

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "businessName": "Event Co."
}
```

**Response:**
```json
{
  "message": "Account created successfully! You have been assigned the Admin role as the first user. Please verify your email.",
  "isFirstUser": true,
  "roleAssigned": "Admin"
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/auth/verify?token={token}`
Verify email address with token.

#### GET `/auth/google`
Initiate Google OAuth flow.

#### GET `/auth/google/callback`
Handle Google OAuth callback.

### Role Management

#### POST `/auth/roles/initialize`
Initialize default system roles (Admin, Project Manager).

**Response:**
```json
{
  "message": "Default roles initialized successfully",
  "roles": {
    "admin": {
      "id": "admin-role-uuid",
      "name": "Admin",
      "description": "System administrator with full access. Cannot be modified.",
      "permissionsCount": 50
    },
    "projectManager": {
      "id": "project-manager-role-uuid",
      "name": "Project Manager",
      "description": "Project manager with full access. Can be modified.",
      "permissionsCount": 50
    }
  },
  "totalPermissions": 50
}
```

#### POST `/auth/roles`
Create a new role.

**Request Body:**
```json
{
  "name": "Event Coordinator",
  "description": "Can manage events and vendors",
  "permissions": ["view_events", "create_events", "edit_events", "view_vendors"]
}
```

#### GET `/auth/roles`
List all roles with their permissions and assigned users.

#### GET `/auth/roles/:id`
Get specific role details.

#### PUT `/auth/roles/:id`
Update role information and permissions.

#### DELETE `/auth/roles/:id`
Delete a role (cannot delete Admin role).

#### POST `/auth/roles/assign`
Assign a role to a user.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "roleId": "role-uuid"
}
```

#### GET `/auth/permissions`
Get all available system permissions.

### User Management

#### GET `/auth/users`
List all users with their roles.

#### GET `/auth/users/:id`
Get specific user details.

#### DELETE `/auth/users/:id`
Delete a user account.

#### POST `/auth/users/:id/roles`
Add a role to a user.

#### DELETE `/auth/users/:id/roles/:roleId`
Remove a role from a user.

#### POST `/auth/users/:id/roles/:roleId`
Change user's primary role.

#### GET `/auth/users/:id/permissions`
Get all permissions for a specific user.

#### POST `/auth/users/:id/permissions/check`
Check if user has specific permission.

### Invitations

#### POST `/auth/invite`
Send user invitation with role assignment.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "roleId": "role-uuid"
}
```

## Authentication Flow

### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Authorization Headers
All protected endpoints require:
```
Authorization: Bearer <jwt-token>
```

## Permission System

### Permission Categories
- **User Management**: view_users, create_users, edit_users, delete_users, invite_users, assign_roles, remove_roles
- **Role Management**: view_roles, create_roles, edit_roles, delete_roles, assign_permissions, remove_permissions
- **Event Management**: view_events, create_events, edit_events, delete_events, view_event_details, manage_event_sections
- **Vendor Management**: view_event_vendors, add_event_vendors, edit_event_vendors, remove_event_vendors, view_global_vendors, create_global_vendors, edit_global_vendors, delete_global_vendors
- **Schedule Management**: view_schedules, create_schedules, edit_schedules, delete_schedules
- **Attachment Management**: view_attachments, upload_attachments, delete_attachments
- **Payment Management**: view_payments, add_payments, edit_payments, delete_payments
- **Deliverable Management**: view_deliverables, create_deliverables, edit_deliverables, delete_deliverables, update_deliverable_status
- **Invoice Management**: view_invoices, create_invoices, edit_invoices, delete_invoices, update_invoice_status
- **Analytics**: view_analytics, view_dashboard, view_activity_logs
- **System Administration**: view_system_health, manage_system_settings, view_audit_logs

## Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgres://festive:festivepass@postgres:5432/festive_db
JWT_SECRET=your-very-strong-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
EMAIL_FROM=noreply@festive.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_SERVICE=gmail
BASE_URL=http://localhost:3001
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
docker-compose up --build auth
```

## Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Registration
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Stateless authentication
- **Email Verification**: Required for account activation
- **Role-based Access Control**: Granular permissions
- **Google OAuth**: Social login integration
- **Session Management**: Express sessions for OAuth
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error responses

## Integration with Other Services

The Auth Service provides:
- **JWT tokens** for service-to-service authentication
- **Permission middleware** for authorization checks
- **User context** for all microservices
- **Role information** for UI rendering decisions

All other microservices depend on the Auth Service for:
- User authentication validation
- Permission-based access control
- User context in requests 