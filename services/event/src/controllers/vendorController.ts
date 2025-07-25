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

export async function addVendorToEvent(req: Request<{ eventId: string }, {}, VendorCreateDTO>, res: Response) {
  try {
    const { name, description, phoneNumber, price, amount, paymentStatus } = req.body;
    let vendor = await prisma.vendor.findFirst({ where: { name, phoneNumber } });
    if (!vendor) {
      vendor = await prisma.vendor.create({ data: { name, description, phoneNumber } });
    }
    const eventVendor = await prisma.eventVendor.create({
      data: {
        eventId: req.params.eventId,
        vendorId: vendor.id,
        price,
        amount,
        paymentStatus,
      },
    });
    res.status(201).json(eventVendor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vendor to event', details: err } as any);
  }
}

export async function listEventVendors(req: Request<{ eventId: string }>, res: Response) {
  try {
    const vendors = await prisma.eventVendor.findMany({
      where: { eventId: req.params.eventId },
      include: { vendor: true },
    });
    res.json(vendors.map(ev => ({ ...ev, vendor: toVendorResponse(ev.vendor) })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list event vendors', details: err } as any);
  }
}

export async function updateEventVendor(req: Request<{ eventId: string; vendorId: string }, {}, VendorUpdateDTO>, res: Response) {
  try {
    const { price, amount, paymentStatus } = req.body;
    const eventVendor = await prisma.eventVendor.update({
      where: { id: req.params.vendorId },
      data: { price, amount, paymentStatus },
    });
    res.json(eventVendor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event vendor', details: err } as any);
  }
}

export async function removeVendorFromEvent(req: Request<{ eventId: string; vendorId: string }>, res: Response) {
  try {
    await prisma.eventVendor.delete({ where: { id: req.params.vendorId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove vendor from event', details: err } as any);
  }
} 