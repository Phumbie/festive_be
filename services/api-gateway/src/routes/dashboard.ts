import { Router } from 'express';
import { getDashboardData, getDashboardHealth } from '../controllers/dashboardController';

const router = Router();

/**
 * Dashboard Routes
 * 
 * PURPOSE: Routes for dashboard aggregation functionality
 * 
 * ENDPOINTS:
 * - GET /api/dashboard - Main dashboard data aggregation
 * - GET /api/dashboard/health - Dashboard service health check
 */

// Main dashboard endpoint - aggregates data from all services
router.get('/dashboard', getDashboardData);

// Dashboard-specific health check
router.get('/dashboard/health', getDashboardHealth);

export default router; 