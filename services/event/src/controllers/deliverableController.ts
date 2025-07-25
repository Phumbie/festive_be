import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { DeliverableCreateDTO, DeliverableUpdateDTO, DeliverableResponse } from '../types/deliverable';

const prisma = new PrismaClient();

function toDeliverableResponse(deliverable: any): DeliverableResponse {
  return {
    ...deliverable,
    date: deliverable.date instanceof Date ? deliverable.date.toISOString() : deliverable.date,
    createdAt: deliverable.createdAt instanceof Date ? deliverable.createdAt.toISOString() : deliverable.createdAt,
  };
}

export async function addDeliverable(req: Request<{ eventId: string; vendorId: string }, {}, DeliverableCreateDTO>, res: Response<DeliverableResponse>) {
  try {
    const { name, description, date, status } = req.body;
    const deliverable = await prisma.deliverable.create({
      data: {
        eventId: req.params.eventId,
        vendorId: req.params.vendorId,
        name,
        description,
        date,
        status,
      },
    });
    res.status(201).json(toDeliverableResponse(deliverable));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add deliverable', details: err } as any);
  }
}

export async function listDeliverables(req: Request<{ eventId: string; vendorId: string }, {}, {}, { status?: string; startDate?: string; endDate?: string }>, res: Response<DeliverableResponse[]>) {
  try {
    const { status, startDate, endDate } = req.query;
    const where: any = {
      eventId: req.params.eventId,
      vendorId: req.params.vendorId,
    };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }
    const deliverables = await prisma.deliverable.findMany({
      where,
    });
    res.json(deliverables.map(toDeliverableResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list deliverables', details: err } as any);
  }
}

export async function updateDeliverable(req: Request<{ eventId: string; vendorId: string; deliverableId: string }, {}, DeliverableUpdateDTO>, res: Response<DeliverableResponse>) {
  try {
    const { name, description, date, status } = req.body;
    const deliverable = await prisma.deliverable.update({
      where: { id: req.params.deliverableId },
      data: { name, description, date, status },
    });
    res.json(toDeliverableResponse(deliverable));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update deliverable', details: err } as any);
  }
}

export async function deleteDeliverable(req: Request<{ eventId: string; vendorId: string; deliverableId: string }>, res: Response) {
  try {
    await prisma.deliverable.delete({ where: { id: req.params.deliverableId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete deliverable', details: err } as any);
  }
} 