import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth';
import { 
  createRole, 
  listRoles, 
  getRoleById,
  updateRole,
  deleteRole,
  assignRole, 
  getPermissions,
  assignPermissionToRole,
  removePermissionFromRole,
  initializeDefaultRoles
} from '../controllers/roleController';

const router = Router();

/**
 * Role Management Routes
 * 
 * PURPOSE: Routes for comprehensive role and permission management
 * 
 * AUTHENTICATION: All routes require JWT authentication
 * AUTHORIZATION: Some routes may require admin permissions
 */

// Initialize default roles (no auth required for system setup)
router.post('/roles/initialize', initializeDefaultRoles);                    // POST /auth/roles/initialize

// Role CRUD operations
router.post('/roles', authenticateJwt, createRole);                    // POST /auth/roles
router.get('/roles', authenticateJwt, listRoles);                     // GET /auth/roles
router.get('/roles/:id', authenticateJwt, getRoleById);               // GET /auth/roles/:id
router.put('/roles/:id', authenticateJwt, updateRole);                // PUT /auth/roles/:id
router.delete('/roles/:id', authenticateJwt, deleteRole);              // DELETE /auth/roles/:id

// Role assignment
router.post('/roles/assign', authenticateJwt, assignRole);             // POST /auth/roles/assign

// Permission management (hardcoded system)
router.get('/permissions', authenticateJwt, getPermissions);           // GET /auth/permissions
router.post('/roles/permissions', authenticateJwt, assignPermissionToRole);           // POST /auth/roles/permissions
router.delete('/roles/:roleId/permissions/:permissionName', authenticateJwt, removePermissionFromRole); // DELETE /auth/roles/:roleId/permissions/:permissionName

export default router; 