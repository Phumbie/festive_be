import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  changeUserRole,
  addRoleToUser,
  removeRoleFromUser,
  checkUserPermission,
  getUserPermissions,
  getStaffMembers
} from '../controllers/userManagementController';

const router = Router();

/**
 * User Management Routes
 * 
 * PURPOSE: Routes for comprehensive user management including
 * user CRUD operations, role assignment, and permission checking.
 * 
 * AUTHENTICATION: All routes require JWT authentication
 * AUTHORIZATION: Some routes may require specific permissions
 */

// User CRUD operations
router.get('/users', getAllUsers);                    // GET /auth/users
router.get('/users/:id', getUserById);                // GET /auth/users/:id
router.delete('/users/:id', deleteUser);              // DELETE /auth/users/:id

// Staff management
router.get('/staff/members', getStaffMembers);        // GET /auth/staff/members

// Role management
router.put('/users/:id/role', changeUserRole);        // PUT /auth/users/:id/role
router.post('/users/:id/roles', addRoleToUser);       // POST /auth/users/:id/roles
router.delete('/users/:id/roles/:roleId', removeRoleFromUser); // DELETE /auth/users/:id/roles/:roleId

// Permission checking
router.get('/users/:id/permissions', getUserPermissions); // GET /auth/users/:id/permissions
router.get('/users/:id/check-permission', checkUserPermission); // GET /auth/users/:id/check-permission?permission=create_event

export default router; 