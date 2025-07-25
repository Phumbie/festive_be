import { Request, Response } from 'express';
import fetch from 'node-fetch';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth:3001';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://event:3002';
const VENDOR_SERVICE_URL = process.env.VENDOR_SERVICE_URL || 'http://vendor:3003';
const INVOICE_SERVICE_URL = process.env.INVOICE_SERVICE_URL || 'http://invoice:3004';

/**
 * Dashboard Aggregation Controller
 * 
 * PURPOSE: Aggregates data from all microservices to provide a comprehensive
 * dashboard view of the entire application.
 * 
 * FEATURES:
 * - Total client payments across all events
 * - Total budgets and outstanding amounts
 * - Event counts (total, upcoming)
 * - Vendor analytics
 * - Invoice statistics
 * - Schedule overview
 * 
 * USAGE: Called by GET /api/dashboard to provide frontend dashboard data
 */
export async function getDashboardData(_req: Request, res: Response) {
  try {
    // Fetch analytics from each service in parallel for better performance
    const [eventRes, vendorRes, invoiceRes] = await Promise.all([
      fetch(`${EVENT_SERVICE_URL}/events/analytics`),
      fetch(`${VENDOR_SERVICE_URL}/vendors/analytics`),
      fetch(`${INVOICE_SERVICE_URL}/invoices`),
    ]);

    // Parse responses
    const eventAnalytics = await eventRes.json() as any;
    const vendorAnalytics = await vendorRes.json() as any;
    const invoices = await invoiceRes.json();

    // Aggregate dashboard data
    const dashboardData = {
      // Financial metrics
      totalClientPayments: eventAnalytics.totalClientPayments || 0,
      totalBudgets: eventAnalytics.totalBudgets || 0,
      totalOutstanding: eventAnalytics.totalOutstanding || 0,
      
      // Event metrics
      totalEvents: eventAnalytics.totalEvents || 0,
      totalUpcomingEvents: eventAnalytics.totalUpcomingEvents || 0,
      
      // Business metrics
      totalInvoicesSent: Array.isArray(invoices) ? invoices.length : 0,
      totalVendors: vendorAnalytics.totalVendors || 0,
      
      // Schedule metrics
      allUpcomingSchedules: eventAnalytics.allUpcomingSchedules || [],
      allUpcomingSchedulesCount: eventAnalytics.allUpcomingSchedulesCount || 0,
    };

    res.json(dashboardData);
  } catch (err) {
    console.error('Dashboard aggregation error:', err);
    res.status(500).json({ 
      error: 'Failed to aggregate dashboard data', 
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}

/**
 * Health Check for Dashboard Service
 * 
 * PURPOSE: Provides a health check endpoint specifically for the dashboard
 * functionality, allowing monitoring of the aggregation service.
 */
export async function getDashboardHealth(_req: Request, res: Response) {
  try {
    // Test connectivity to all services
    const healthChecks = await Promise.allSettled([
      fetch(`${AUTH_SERVICE_URL}/health`),
      fetch(`${EVENT_SERVICE_URL}/health`),
      fetch(`${VENDOR_SERVICE_URL}/health`),
      fetch(`${INVOICE_SERVICE_URL}/health`),
    ]);

    const serviceStatus = {
      auth: healthChecks[0].status === 'fulfilled',
      event: healthChecks[1].status === 'fulfilled',
      vendor: healthChecks[2].status === 'fulfilled',
      invoice: healthChecks[3].status === 'fulfilled',
    };

    const allHealthy = Object.values(serviceStatus).every(status => status);

    res.json({
      status: allHealthy ? 'healthy' : 'degraded',
      service: 'dashboard-aggregation',
      dependencies: serviceStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'dashboard-aggregation',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
} 