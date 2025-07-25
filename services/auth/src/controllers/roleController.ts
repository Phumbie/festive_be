import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Role Management Controller
 * 
 * PURPOSE: Comprehensive role and permission management including
 * CRUD operations for roles and permissions, and role-permission assignments.
 */

// Hardcoded permissions based on the event management platform features
const SYSTEM_PERMISSIONS = [
  // User Management
  { name: 'view_users', description: 'View all users in the system' },
  { name: 'create_users', description: 'Create new user accounts' },
  { name: 'edit_users', description: 'Edit user information' },
  { name: 'delete_users', description: 'Delete user accounts' },
  { name: 'invite_users', description: 'Send user invitations' },
  { name: 'assign_roles', description: 'Assign roles to users' },
  { name: 'remove_roles', description: 'Remove roles from users' },

  // Role Management
  { name: 'view_roles', description: 'View all roles in the system' },
  { name: 'create_roles', description: 'Create new roles' },
  { name: 'edit_roles', description: 'Edit role information' },
  { name: 'delete_roles', description: 'Delete roles' },
  { name: 'assign_permissions', description: 'Assign permissions to roles' },
  { name: 'remove_permissions', description: 'Remove permissions from roles' },

  // Event Management
  { name: 'view_events', description: 'View all events' },
  { name: 'create_events', description: 'Create new events' },
  { name: 'edit_events', description: 'Edit event information' },
  { name: 'delete_events', description: 'Delete events' },
  { name: 'view_event_details', description: 'View detailed event information' },
  { name: 'manage_event_sections', description: 'Manage event sections and items' },

  // Event Vendors
  { name: 'view_event_vendors', description: 'View vendors for events' },
  { name: 'add_event_vendors', description: 'Add vendors to events' },
  { name: 'edit_event_vendors', description: 'Edit event vendor information' },
  { name: 'remove_event_vendors', description: 'Remove vendors from events' },

  // Global Vendors
  { name: 'view_global_vendors', description: 'View all global vendors' },
  { name: 'create_global_vendors', description: 'Create new global vendors' },
  { name: 'edit_global_vendors', description: 'Edit global vendor information' },
  { name: 'delete_global_vendors', description: 'Delete global vendors' },

  // Schedules
  { name: 'view_schedules', description: 'View event schedules' },
  { name: 'create_schedules', description: 'Create new schedules' },
  { name: 'edit_schedules', description: 'Edit schedule information' },
  { name: 'delete_schedules', description: 'Delete schedules' },

  // Attachments
  { name: 'view_attachments', description: 'View event attachments' },
  { name: 'upload_attachments', description: 'Upload files to events' },
  { name: 'delete_attachments', description: 'Delete event attachments' },

  // Payments
  { name: 'view_payments', description: 'View event payments' },
  { name: 'add_payments', description: 'Add payments to events' },
  { name: 'edit_payments', description: 'Edit payment information' },
  { name: 'delete_payments', description: 'Delete payments' },

  // Deliverables
  { name: 'view_deliverables', description: 'View event deliverables' },
  { name: 'create_deliverables', description: 'Create new deliverables' },
  { name: 'edit_deliverables', description: 'Edit deliverable information' },
  { name: 'delete_deliverables', description: 'Delete deliverables' },
  { name: 'update_deliverable_status', description: 'Update deliverable status' },

  // Invoices
  { name: 'view_invoices', description: 'View all invoices' },
  { name: 'create_invoices', description: 'Create new invoices' },
  { name: 'edit_invoices', description: 'Edit invoice information' },
  { name: 'delete_invoices', description: 'Delete invoices' },
  { name: 'update_invoice_status', description: 'Update invoice status' },

  // Analytics & Dashboard
  { name: 'view_analytics', description: 'View event analytics' },
  { name: 'view_dashboard', description: 'View dashboard data' },
  { name: 'view_activity_logs', description: 'View activity logs' },

  // System Administration
  { name: 'view_system_health', description: 'View system health status' },
  { name: 'manage_system_settings', description: 'Manage system settings' },
  { name: 'view_audit_logs', description: 'View audit logs' },
];

export async function createRole(req: Request, res: Response) {
  const { name, description, permissions } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Role name is required' });
  }

  // Validate permissions if provided
  if (permissions && Array.isArray(permissions)) {
    const invalidPermissions = permissions.filter(perm => 
      !SYSTEM_PERMISSIONS.find(sysPerm => sysPerm.name === perm)
    );
    
    if (invalidPermissions.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid permissions provided',
        invalidPermissions,
        availablePermissions: SYSTEM_PERMISSIONS.map(p => p.name)
      });
    }
  }

  try {
    // Create the role
    const role = await prisma.role.create({ 
      data: { 
        name, 
        description,
        permissions: permissions && permissions.length > 0 ? {
          connect: permissions.map((permName: string) => ({ name: permName }))
        } : undefined
      },
      include: {
        permissions: true
      }
    });
    
    res.status(201).json({ 
      role,
      message: permissions && permissions.length > 0 
        ? `Role created with ${permissions.length} permissions` 
        : 'Role created without permissions'
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create role', details: err });
  }
}

export async function listRoles(_req: Request, res: Response) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    res.json({ roles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list roles', details: err });
  }
}

export async function getRoleById(req: Request<{ id: string }>, res: Response) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: req.params.id },
      include: {
        permissions: true,
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch role', details: err });
  }
}

/**
 * Create default roles (admin and project manager)
 * This should be called during system initialization
 */
export async function createDefaultRoles() {
  try {
    // Check if default roles already exist
    const existingAdmin = await prisma.role.findUnique({ where: { name: 'Admin' } });
    const existingProjectManager = await prisma.role.findUnique({ where: { name: 'Project Manager' } });

    let adminRole = existingAdmin;
    let projectManagerRole = existingProjectManager;

    // Create Admin role with all permissions (if it doesn't exist)
    if (!existingAdmin) {
      adminRole = await prisma.role.create({
        data: {
          name: 'Admin',
          description: 'System administrator with full access. Cannot be modified.',
          permissions: {
            connect: SYSTEM_PERMISSIONS.map(perm => ({ name: perm.name }))
          }
        },
        include: {
          permissions: true
        }
      });
      console.log('✅ Admin role created with all permissions');
    }

    // Create Project Manager role with all permissions (if it doesn't exist)
    if (!existingProjectManager) {
      projectManagerRole = await prisma.role.create({
        data: {
          name: 'Project Manager',
          description: 'Project manager with full access. Can be modified.',
          permissions: {
            connect: SYSTEM_PERMISSIONS.map(perm => ({ name: perm.name }))
          }
        },
        include: {
          permissions: true
        }
      });
      console.log('✅ Project Manager role created with all permissions');
    }

    return {
      adminRole,
      projectManagerRole
    };
  } catch (err) {
    console.error('❌ Failed to create default roles:', err);
    throw err;
  }
}

/**
 * Assign admin role to the first user (account creator)
 */
export async function assignAdminRoleToUser(userId: string) {
  try {
    const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
    
    if (!adminRole) {
      throw new Error('Admin role not found. Please run createDefaultRoles first.');
    }

    // Check if user already has admin role
    const existingUserRole = await prisma.userRole.findFirst({
      where: { userId, roleId: adminRole.id }
    });

    if (!existingUserRole) {
      await prisma.userRole.create({
        data: { userId, roleId: adminRole.id }
      });
      console.log(`✅ Admin role assigned to user ${userId}`);
    }

    return adminRole;
  } catch (err) {
    console.error('❌ Failed to assign admin role:', err);
    throw err;
  }
}

export async function updateRole(req: Request<{ id: string }>, res: Response) {
  const { name, description, permissions } = req.body;
  
  try {
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: req.params.id },
      include: {
        permissions: true
      }
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent editing of Admin role
    if (existingRole.name === 'Admin') {
      return res.status(403).json({ 
        error: 'Cannot modify Admin role. This role is system-protected and cannot be edited.',
        roleName: existingRole.name
      });
    }

    // Validate permissions if provided
    if (permissions && Array.isArray(permissions)) {
      const invalidPermissions = permissions.filter(perm => 
        !SYSTEM_PERMISSIONS.find(sysPerm => sysPerm.name === perm)
      );
      
      if (invalidPermissions.length > 0) {
        return res.status(400).json({ 
          error: 'Invalid permissions provided',
          invalidPermissions,
          availablePermissions: SYSTEM_PERMISSIONS.map(p => p.name)
        });
      }
    }

    // Update the role
    const role = await prisma.role.update({
      where: { id: req.params.id },
      data: { 
        name, 
        description,
        permissions: permissions ? {
          set: permissions.map((permName: string) => ({ name: permName }))
        } : undefined
      },
      include: {
        permissions: true
      }
    });

    const permissionChanges = permissions 
      ? `Permissions updated to: ${permissions.join(', ')}`
      : 'Role updated without permission changes';

    res.json({ 
      role,
      message: `Role updated successfully. ${permissionChanges}`
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Role not found' });
    }
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to update role', details: err });
  }
}

export async function deleteRole(req: Request<{ id: string }>, res: Response) {
  try {
    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: req.params.id },
      include: {
        users: true
      }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent deletion of Admin role
    if (role.name === 'Admin') {
      return res.status(403).json({ 
        error: 'Cannot delete Admin role. This role is system-protected and cannot be deleted.',
        roleName: role.name
      });
    }

    // Check if role is assigned to any users
    if (role.users.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete role that is assigned to users',
        assignedUsers: role.users.length
      });
    }

    // Delete role permissions first
    await prisma.role.update({
      where: { id: req.params.id },
      data: {
        permissions: {
          set: [] // Remove all permissions
        }
      }
    });

    // Delete the role
    await prisma.role.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete role', details: err });
  }
}

export async function assignRole(req: Request, res: Response) {
  const { userId, roleId } = req.body;
  
  if (!userId || !roleId) {
    return res.status(400).json({ error: 'User ID and Role ID are required' });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if role is already assigned
    const existingUserRole = await prisma.userRole.findFirst({
      where: { userId, roleId }
    });

    if (existingUserRole) {
      return res.status(400).json({ error: 'Role is already assigned to this user' });
    }

    const userRole = await prisma.userRole.create({ 
      data: { userId, roleId },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    res.status(201).json({ userRole });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign role', details: err });
  }
}

/**
 * Get all available system permissions
 * 
 * PURPOSE: Returns hardcoded permissions that can be assigned to roles.
 * These permissions are based on the event management platform features.
 */
export async function getPermissions(_req: Request, res: Response) {
  try {
    // Get permissions from database (for roles that have them assigned)
    const dbPermissions = await prisma.permission.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Combine system permissions with database permissions
    const allPermissions = SYSTEM_PERMISSIONS.map(sysPerm => {
      const dbPerm = dbPermissions.find(db => db.name === sysPerm.name);
      return {
        ...sysPerm,
        id: dbPerm?.id || null,
        assignedRoles: dbPerm?.roles || []
      };
    });

    res.json({ 
      permissions: allPermissions,
      total: allPermissions.length,
      categories: {
        userManagement: allPermissions.filter(p => p.name.startsWith('view_users') || p.name.startsWith('create_users') || p.name.startsWith('edit_users') || p.name.startsWith('delete_users') || p.name.startsWith('invite_users') || p.name.startsWith('assign_roles') || p.name.startsWith('remove_roles')),
        roleManagement: allPermissions.filter(p => p.name.startsWith('view_roles') || p.name.startsWith('create_roles') || p.name.startsWith('edit_roles') || p.name.startsWith('delete_roles') || p.name.startsWith('assign_permissions') || p.name.startsWith('remove_permissions')),
        eventManagement: allPermissions.filter(p => p.name.startsWith('view_events') || p.name.startsWith('create_events') || p.name.startsWith('edit_events') || p.name.startsWith('delete_events') || p.name.startsWith('view_event_details') || p.name.startsWith('manage_event_sections')),
        vendorManagement: allPermissions.filter(p => p.name.includes('vendor')),
        scheduleManagement: allPermissions.filter(p => p.name.includes('schedule')),
        attachmentManagement: allPermissions.filter(p => p.name.includes('attachment')),
        paymentManagement: allPermissions.filter(p => p.name.includes('payment')),
        deliverableManagement: allPermissions.filter(p => p.name.includes('deliverable')),
        invoiceManagement: allPermissions.filter(p => p.name.includes('invoice')),
        analytics: allPermissions.filter(p => p.name.includes('analytics') || p.name.includes('dashboard') || p.name.includes('activity_logs')),
        systemAdmin: allPermissions.filter(p => p.name.includes('system_health') || p.name.includes('system_settings') || p.name.includes('audit_logs'))
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get permissions', details: err });
  }
}

export async function assignPermissionToRole(req: Request, res: Response) {
  const { roleId, permissionName } = req.body;
  
  if (!roleId || !permissionName) {
    return res.status(400).json({ error: 'Role ID and Permission Name are required' });
  }

  // Validate that the permission exists in our system
  const systemPermission = SYSTEM_PERMISSIONS.find(p => p.name === permissionName);
  if (!systemPermission) {
    return res.status(400).json({ 
      error: 'Invalid permission name',
      availablePermissions: SYSTEM_PERMISSIONS.map(p => p.name)
    });
  }

  try {
    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if permission exists in database, create if not
    let permission = await prisma.permission.findUnique({
      where: { name: permissionName }
    });

    if (!permission) {
      permission = await prisma.permission.create({
        data: {
          name: permissionName,
          description: systemPermission.description
        }
      });
    }

    // Check if permission is already assigned to role
    const existingRolePermission = await prisma.role.findFirst({
      where: {
        id: roleId,
        permissions: {
          some: {
            id: permission.id
          }
        }
      }
    });

    if (existingRolePermission) {
      return res.status(400).json({ error: 'Permission is already assigned to this role' });
    }

    // Add permission to role
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: { id: permission.id }
        }
      },
      include: {
        permissions: true
      }
    });

    res.json({ 
      message: 'Permission assigned to role successfully',
      permission: {
        id: permission.id,
        name: permission.name,
        description: permission.description
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign permission to role', details: err });
  }
}

export async function removePermissionFromRole(req: Request<{ roleId: string; permissionName: string }>, res: Response) {
  const { roleId, permissionName } = req.params;

  try {
    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if permission exists
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName }
    });

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Remove permission from role
    await prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: { id: permission.id }
        }
      }
    });

    res.json({ message: 'Permission removed from role successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove permission from role', details: err });
  }
} 

/**
 * Initialize default roles endpoint
 * This can be called manually to create default roles for existing systems
 */
export async function initializeDefaultRoles(req: Request, res: Response) {
  try {
    const result = await createDefaultRoles();
    
    res.json({
      message: 'Default roles initialized successfully',
      roles: {
        admin: {
          id: result.adminRole?.id,
          name: result.adminRole?.name,
          description: result.adminRole?.description,
          permissionsCount: (result.adminRole as any)?.permissions?.length || 0
        },
        projectManager: {
          id: result.projectManagerRole?.id,
          name: result.projectManagerRole?.name,
          description: result.projectManagerRole?.description,
          permissionsCount: (result.projectManagerRole as any)?.permissions?.length || 0
        }
      },
      totalPermissions: SYSTEM_PERMISSIONS.length
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to initialize default roles', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
} 