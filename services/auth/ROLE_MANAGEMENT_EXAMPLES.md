# Role Management Documentation

## Overview

The role management system allows you to create roles with predefined permissions and manage user access to different features of the event management platform.

## Default Roles

### Admin Role
- **Name**: `Admin`
- **Description**: System administrator with full access. Cannot be modified.
- **Permissions**: All system permissions (50+ permissions)
- **Protection**: Cannot be edited or deleted
- **Assignment**: Automatically assigned to the first user who registers

### Project Manager Role
- **Name**: `Project Manager`
- **Description**: Project manager with full access. Can be modified.
- **Permissions**: All system permissions (50+ permissions)
- **Protection**: Can be edited and deleted
- **Assignment**: Can be manually assigned to users

## System Initialization

### Automatic Initialization
Default roles are automatically created when the first user registers:
```bash
POST /auth/register
{
  "email": "admin@example.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User"
}
```

**Response for first user:**
```json
{
  "message": "Account created successfully! You have been assigned the Admin role as the first user. Please verify your email.",
  "isFirstUser": true,
  "roleAssigned": "Admin"
}
```

### Manual Initialization
For existing systems, you can manually initialize default roles:
```bash
POST /auth/roles/initialize
```

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

## Available Permissions

### Event Management
- `view_events` - View all events
- `create_events` - Create new events
- `edit_events` - Edit event information
- `delete_events` - Delete events
- `view_event_details` - View detailed event information
- `manage_event_sections` - Manage event sections and items

### Vendor Management
- `view_event_vendors` - View vendors for events
- `add_event_vendors` - Add vendors to events
- `edit_event_vendors` - Edit event vendor information
- `remove_event_vendors` - Remove vendors from events
- `view_global_vendors` - View all global vendors
- `create_global_vendors` - Create new global vendors
- `edit_global_vendors` - Edit global vendor information
- `delete_global_vendors` - Delete global vendors

### Schedule Management
- `view_schedules` - View event schedules
- `create_schedules` - Create new schedules
- `edit_schedules` - Edit schedule information
- `delete_schedules` - Delete schedules

### Attachment Management
- `view_attachments` - View event attachments
- `upload_attachments` - Upload files to events
- `delete_attachments` - Delete event attachments

### Payment Management
- `view_payments` - View event payments
- `add_payments` - Add payments to events
- `edit_payments` - Edit payment information
- `delete_payments` - Delete payments

### Deliverable Management
- `view_deliverables` - View event deliverables
- `create_deliverables` - Create new deliverables
- `edit_deliverables` - Edit deliverable information
- `delete_deliverables` - Delete deliverables
- `update_deliverable_status` - Update deliverable status

### Invoice Management
- `view_invoices` - View all invoices
- `create_invoices` - Create new invoices
- `edit_invoices` - Edit invoice information
- `delete_invoices` - Delete invoices
- `update_invoice_status` - Update invoice status

### User Management
- `view_users` - View all users in the system
- `create_users` - Create new user accounts
- `edit_users` - Edit user information
- `delete_users` - Delete user accounts
- `invite_users` - Send user invitations
- `assign_roles` - Assign roles to users
- `remove_roles` - Remove roles from users

### Role Management
- `view_roles` - View all roles in the system
- `create_roles` - Create new roles
- `edit_roles` - Edit role information
- `delete_roles` - Delete roles
- `assign_permissions` - Assign permissions to roles
- `remove_permissions` - Remove permissions from roles

### Analytics & Dashboard
- `view_analytics` - View event analytics
- `view_dashboard` - View dashboard data
- `view_activity_logs` - View activity logs

### System Administration
- `view_system_health` - View system health status
- `manage_system_settings` - Manage system settings
- `view_audit_logs` - View audit logs

## API Endpoints

### Initialize Default Roles
```bash
POST /auth/roles/initialize
```

### Create Role with Permissions
```bash
POST /auth/roles
Content-Type: application/json

{
  "name": "Event Manager",
  "description": "Can manage events and related features",
  "permissions": [
    "view_events",
    "create_events", 
    "edit_events",
    "view_event_details",
    "view_schedules",
    "create_schedules",
    "view_attachments",
    "upload_attachments"
  ]
}
```

**Response:**
```json
{
  "role": {
    "id": "role-uuid",
    "name": "Event Manager",
    "description": "Can manage events and related features",
    "permissions": [
      {
        "id": "perm-uuid",
        "name": "view_events",
        "description": "View all events"
      }
      // ... other permissions
    ]
  },
  "message": "Role created with 8 permissions"
}
```

### Update Role with New Permissions
```bash
PUT /auth/roles/role-uuid
Content-Type: application/json

{
  "name": "Senior Event Manager",
  "description": "Can manage events and vendors",
  "permissions": [
    "view_events",
    "create_events",
    "edit_events", 
    "view_event_details",
    "view_schedules",
    "create_schedules",
    "view_attachments",
    "upload_attachments",
    "view_event_vendors",
    "add_event_vendors",
    "edit_event_vendors"
  ]
}
```

**Response:**
```json
{
  "role": {
    "id": "role-uuid",
    "name": "Senior Event Manager", 
    "description": "Can manage events and vendors",
    "permissions": [
      // ... updated permissions list
    ]
  },
  "message": "Role updated successfully. Permissions updated to: view_events, create_events, edit_events, view_event_details, view_schedules, create_schedules, view_attachments, upload_attachments, view_event_vendors, add_event_vendors, edit_event_vendors"
}
```

### Get All Permissions
```bash
GET /auth/permissions
```

**Response:**
```json
{
  "permissions": [
    {
      "name": "create_events",
      "description": "Create new events",
      "id": "uuid-or-null",
      "assignedRoles": []
    }
  ],
  "total": 50,
  "categories": {
    "userManagement": [...],
    "eventManagement": [...],
    "vendorManagement": [...],
    "scheduleManagement": [...],
    "attachmentManagement": [...],
    "paymentManagement": [...],
    "deliverableManagement": [...],
    "invoiceManagement": [...],
    "analytics": [...],
    "systemAdmin": [...]
  }
}
```

### List All Roles
```bash
GET /auth/roles
```

**Response:**
```json
{
  "roles": [
    {
      "id": "role-uuid",
      "name": "Admin",
      "description": "System administrator with full access. Cannot be modified.",
      "permissions": [...],
      "users": [
        {
          "id": "user-uuid",
          "email": "admin@example.com",
          "firstName": "John",
          "lastName": "Doe"
        }
      ]
    }
  ]
}
```

### Get Role by ID
```bash
GET /auth/roles/role-uuid
```

### Delete Role
```bash
DELETE /auth/roles/role-uuid
```

**Note:** Cannot delete roles that are assigned to users or the Admin role.

## Common Role Examples

### Event Planner Role
```bash
POST /auth/roles
{
  "name": "Event Planner",
  "description": "Can manage events and schedules",
  "permissions": [
    "view_events", "create_events", "edit_events",
    "view_schedules", "create_schedules", "edit_schedules",
    "view_attachments", "upload_attachments"
  ]
}
```

### Vendor Manager Role
```bash
POST /auth/roles
{
  "name": "Vendor Manager",
  "description": "Can manage vendors and payments",
  "permissions": [
    "view_global_vendors", "create_global_vendors", "edit_global_vendors",
    "view_event_vendors", "add_event_vendors", "edit_event_vendors",
    "view_payments", "add_payments", "edit_payments"
  ]
}
```

### Viewer Role
```bash
POST /auth/roles
{
  "name": "Viewer",
  "description": "Read-only access to events",
  "permissions": [
    "view_events", "view_event_details",
    "view_schedules", "view_attachments"
  ]
}
```

## Permission Middleware Usage

### Single Permission Check
```typescript
router.post('/events', authenticateJwt, requirePermission('create_events'), createEvent);
```

### Multiple Permissions (OR Logic)
```typescript
router.get('/events', authenticateJwt, requirePermissions(['view_events', 'view_analytics']), listEvents);
```

### Multiple Permissions (AND Logic)
```typescript
router.delete('/events/:id', authenticateJwt, requireAllPermissions(['delete_events', 'view_events']), deleteEvent);
```

### Admin Only
```typescript
router.delete('/users/:id', authenticateJwt, requireAdmin(), deleteUser);
```

## Error Handling

### Invalid Permissions
```json
{
  "error": "Invalid permissions provided",
  "invalidPermissions": ["invalid_permission"],
  "availablePermissions": ["view_events", "create_events", ...]
}
```

### Role Already Exists
```json
{
  "error": "Role with this name already exists"
}
```

### Role Not Found
```json
{
  "error": "Role not found"
}
```

### Cannot Delete Role with Users
```json
{
  "error": "Cannot delete role that is assigned to users",
  "assignedUsers": 3
}
```

### Cannot Modify Admin Role
```json
{
  "error": "Cannot modify Admin role. This role is system-protected and cannot be edited.",
  "roleName": "Admin"
}
```

### Cannot Delete Admin Role
```json
{
  "error": "Cannot delete Admin role. This role is system-protected and cannot be deleted.",
  "roleName": "Admin"
}
```

## Best Practices

1. **Start with Minimal Permissions**: Only assign permissions that are absolutely necessary
2. **Use Descriptive Role Names**: Make role names clear and meaningful
3. **Regular Permission Reviews**: Periodically review and update role permissions
4. **Test Permissions**: Always test role permissions before deploying to production
5. **Document Role Purposes**: Keep clear documentation of what each role is for
6. **Protect Admin Role**: Never modify the Admin role as it's system-protected
7. **Use Project Manager Role**: For users who need full access but should be able to modify their role

## Security Considerations

- All role management endpoints require authentication
- Only users with appropriate permissions can manage roles
- Invalid permissions are rejected with clear error messages
- Role deletion is prevented if users are assigned to the role
- Permission checks are performed at the middleware level
- Admin role is system-protected and cannot be modified or deleted
- First user automatically becomes Admin with full system access 