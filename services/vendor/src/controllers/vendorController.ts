import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { VendorCreateDTO, VendorUpdateDTO, VendorResponse } from '../types/vendor';

const prisma = new PrismaClient();

function toVendorResponse(vendor: any): VendorResponse {
  return {
    ...vendor,
    createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
    updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
  };
}

export async function createVendor(req: Request<{}, {}, VendorCreateDTO>, res: Response<VendorResponse>) {
  try {
    const vendor = await prisma.vendor.create({ data: req.body });
    res.status(201).json(toVendorResponse(vendor));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vendor', details: err } as any);
  }
}

export async function getVendor(req: Request<{ id: string }>, res: Response<VendorResponse | { error: string }>) {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(toVendorResponse(vendor));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get vendor', details: err } as any);
  }
}

export async function updateVendor(req: Request<{ id: string }, {}, VendorUpdateDTO>, res: Response<VendorResponse>) {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(toVendorResponse(vendor));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vendor', details: err } as any);
  }
}

export async function deleteVendor(req: Request<{ id: string }>, res: Response) {
  try {
    await prisma.vendor.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vendor', details: err } as any);
  }
}

export async function listVendors(_req: Request, res: Response<VendorResponse[]>) {
  try {
    const vendors = await prisma.vendor.findMany();
    res.json(vendors.map(toVendorResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list vendors', details: err } as any);
  }
} 