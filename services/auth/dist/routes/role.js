"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const roleController_1 = require("../controllers/roleController");
const router = (0, express_1.Router)();
/**
 * Role Management Routes
 *
 * PURPOSE: Routes for comprehensive role and permission management
 *
 * AUTHENTICATION: All routes require JWT authentication
 * AUTHORIZATION: Some routes may require admin permissions
 */
// Initialize default roles (no auth required for system setup)
router.post('/roles/initialize', roleController_1.initializeDefaultRoles); // POST /auth/roles/initialize
// Role CRUD operations
router.post('/roles', auth_1.authenticateJwt, roleController_1.createRole); // POST /auth/roles
router.get('/roles', auth_1.authenticateJwt, roleController_1.listRoles); // GET /auth/roles
router.get('/roles/:id', auth_1.authenticateJwt, roleController_1.getRoleById); // GET /auth/roles/:id
router.put('/roles/:id', auth_1.authenticateJwt, roleController_1.updateRole); // PUT /auth/roles/:id
router.delete('/roles/:id', auth_1.authenticateJwt, roleController_1.deleteRole); // DELETE /auth/roles/:id
// Role assignment
router.post('/roles/assign', auth_1.authenticateJwt, roleController_1.assignRole); // POST /auth/roles/assign
// Permission management (hardcoded system)
router.get('/permissions', auth_1.authenticateJwt, roleController_1.getPermissions); // GET /auth/permissions
router.post('/roles/permissions', auth_1.authenticateJwt, roleController_1.assignPermissionToRole); // POST /auth/roles/permissions
router.delete('/roles/:roleId/permissions/:permissionName', auth_1.authenticateJwt, roleController_1.removePermissionFromRole); // DELETE /auth/roles/:roleId/permissions/:permissionName
exports.default = router;
