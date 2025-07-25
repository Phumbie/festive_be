import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllVendorsAnalytics(_req: Request, res: Response) {
  try {
    const vendors = await prisma.vendor.findMany({ include: { vendorEvents: true } });
    const analytics = vendors.map(vendor => {
      const eventCount = vendor.vendorEvents.length;
      const totalAmount = vendor.vendorEvents.reduce((sum, ve) => sum + (ve.amount || 0), 0);
      return {
        id: vendor.id,
        name: vendor.name,
        eventCount,
        totalAmount,
        createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
        updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
      };
    });
    res.json({ totalVendors: vendors.length, vendors: analytics });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get vendor analytics', details: err });
  }
}

export async function getVendorAnalytics(req: Request<{ id: string }>, res: Response) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: { vendorEvents: true },
    });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    const eventCount = vendor.vendorEvents.length;
    const totalAmount = vendor.vendorEvents.reduce((sum, ve) => sum + (ve.amount || 0), 0);
    res.json({
      id: vendor.id,
      name: vendor.name,
      eventCount,
      totalAmount,
      createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
      updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get vendor analytics', details: err });
  }
} 