import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * User Management Controller
 * 
 * PURPOSE: Comprehensive user management including role assignment,
 * user deletion, role changes, and permission management.
 */

/**
 * Get all users with their roles and permissions
 */
export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    const usersWithRoles = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      businessName: user.businessName,
      emailVerified: user.emailVerified,
      roles: user.roles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        permissions: ur.role.permissions
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({ users: usersWithRoles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err });
  }
}

/**
 * Get user by ID with roles and permissions
 */
export async function getUserById(req: Request<{ id: string }>, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userWithRoles = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      businessName: user.businessName,
      emailVerified: user.emailVerified,
      roles: user.roles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        permissions: ur.role.permissions
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: userWithRoles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err });
  }
}

/**
 * Delete user and all associated data
 */
export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user roles first (due to foreign key constraints)
    await prisma.userRole.deleteMany({
      where: { userId }
    });

    // Delete verification tokens
    await prisma.verificationToken.deleteMany({
      where: { userId }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err });
  }
}

/**
 * Change user's role
 */
export async function changeUserRole(req: Request<{ id: string }>, res: Response) {
  try {
    const { roleId } = req.body;
    const userId = req.params.id;

    if (!roleId) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

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

    // Remove all existing roles for the user
    await prisma.userRole.deleteMany({
      where: { userId }
    });

    // Assign the new role
    const userRole = await prisma.userRole.create({
      data: { userId, roleId },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    res.json({
      message: 'User role changed successfully',
      userRole: {
        id: userRole.id,
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
          description: userRole.role.description,
          permissions: userRole.role.permissions
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change user role', details: err });
  }
}

/**
 * Add role to user (without removing existing roles)
 */
export async function addRoleToUser(req: Request<{ id: string }>, res: Response) {
  try {
    const { roleId } = req.body;
    const userId = req.params.id;

    if (!roleId) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

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

    // Check if user already has this role
    const existingUserRole = await prisma.userRole.findFirst({
      where: { userId, roleId }
    });

    if (existingUserRole) {
      return res.status(400).json({ error: 'User already has this role' });
    }

    // Add the role
    const userRole = await prisma.userRole.create({
      data: { userId, roleId },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    res.json({
      message: 'Role added to user successfully',
      userRole: {
        id: userRole.id,
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
          description: userRole.role.description,
          permissions: userRole.role.permissions
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add role to user', details: err });
  }
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(req: Request<{ id: string; roleId: string }>, res: Response) {
  try {
    const { id: userId, roleId } = req.params;

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

    // Remove the role
    await prisma.userRole.deleteMany({
      where: { userId, roleId }
    });

    res.json({ message: 'Role removed from user successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove role from user', details: err });
  }
}

/**
 * Check if user has specific permission
 */
export async function checkUserPermission(req: Request<{ id: string }>, res: Response) {
  try {
    const { permission } = req.query;
    const userId = req.params.id;

    if (!permission) {
      return res.status(400).json({ error: 'Permission parameter is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has the permission through any of their roles
    const hasPermission = user.roles.some(userRole =>
      userRole.role.permissions.some(perm => perm.name === permission)
    );

    res.json({
      userId,
      permission: permission as string,
      hasPermission,
      userRoles: user.roles.map(ur => ur.role.name)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check user permission', details: err });
  }
}

/**
 * Get user's permissions
 */
export async function getUserPermissions(req: Request<{ id: string }>, res: Response) {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Collect all unique permissions from user's roles
    const permissions = new Set();
    const roles = new Set();

    user.roles.forEach(userRole => {
      roles.add(userRole.role.name);
      userRole.role.permissions.forEach(permission => {
        permissions.add(permission.name);
      });
    });

    res.json({
      userId,
      roles: Array.from(roles),
      permissions: Array.from(permissions)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user permissions', details: err });
  }
} 