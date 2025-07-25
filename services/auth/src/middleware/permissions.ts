import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Permission Middleware
 * 
 * PURPOSE: Middleware to check if the authenticated user has specific permissions
 * 
 * USAGE: 
 * - requirePermission('create_events') - Check for single permission
 * - requirePermissions(['create_events', 'edit_events']) - Check for multiple permissions (OR logic)
 * - requireAllPermissions(['create_events', 'edit_events']) - Check for multiple permissions (AND logic)
 */

/**
 * Check if user has a specific permission
 */
export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
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

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          requiredPermission: permission,
          userRoles: user.roles.map(ur => ur.role.name)
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'Failed to check permissions', details: err });
    }
  };
}

/**
 * Check if user has any of the specified permissions (OR logic)
 */
export function requirePermissions(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
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

      // Get all user permissions
      const userPermissions = new Set();
      user.roles.forEach(userRole => {
        userRole.role.permissions.forEach(permission => {
          userPermissions.add(permission.name);
        });
      });

      // Check if user has any of the required permissions
      const hasAnyPermission = permissions.some(permission => 
        userPermissions.has(permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          requiredPermissions: permissions,
          userPermissions: Array.from(userPermissions),
          userRoles: user.roles.map(ur => ur.role.name)
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'Failed to check permissions', details: err });
    }
  };
}

/**
 * Check if user has all of the specified permissions (AND logic)
 */
export function requireAllPermissions(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
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

      // Get all user permissions
      const userPermissions = new Set();
      user.roles.forEach(userRole => {
        userRole.role.permissions.forEach(permission => {
          userPermissions.add(permission.name);
        });
      });

      // Check if user has all of the required permissions
      const hasAllPermissions = permissions.every(permission => 
        userPermissions.has(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = permissions.filter(permission => 
          !userPermissions.has(permission)
        );

        return res.status(403).json({ 
          error: 'Insufficient permissions',
          requiredPermissions: permissions,
          missingPermissions,
          userPermissions: Array.from(userPermissions),
          userRoles: user.roles.map(ur => ur.role.name)
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'Failed to check permissions', details: err });
    }
  };
}

/**
 * Check if user has admin role
 */
export function requireAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user has admin role
      const hasAdminRole = user.roles.some(userRole => 
        userRole.role.name.toLowerCase() === 'admin'
      );

      if (!hasAdminRole) {
        return res.status(403).json({ 
          error: 'Admin access required',
          userRoles: user.roles.map(ur => ur.role.name)
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'Failed to check admin status', details: err });
    }
  };
} 