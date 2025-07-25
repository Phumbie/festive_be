"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userManagementController_1 = require("../controllers/userManagementController");
const router = (0, express_1.Router)();
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
router.get('/users', userManagementController_1.getAllUsers); // GET /auth/users
router.get('/users/:id', userManagementController_1.getUserById); // GET /auth/users/:id
router.delete('/users/:id', userManagementController_1.deleteUser); // DELETE /auth/users/:id
// Role management
router.put('/users/:id/role', userManagementController_1.changeUserRole); // PUT /auth/users/:id/role
router.post('/users/:id/roles', userManagementController_1.addRoleToUser); // POST /auth/users/:id/roles
router.delete('/users/:id/roles/:roleId', userManagementController_1.removeRoleFromUser); // DELETE /auth/users/:id/roles/:roleId
// Permission checking
router.get('/users/:id/permissions', userManagementController_1.getUserPermissions); // GET /auth/users/:id/permissions
router.get('/users/:id/check-permission', userManagementController_1.checkUserPermission); // GET /auth/users/:id/check-permission?permission=create_event
exports.default = router;
