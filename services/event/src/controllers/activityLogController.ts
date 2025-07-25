import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listActivityLogs(req: Request, res: Response) {
  try {
    const { status } = req.query;
    const eventId = req.params.eventId;
    const statusStr = typeof status === 'string' ? status : Array.isArray(status) ? status[0] : undefined;
    // Fetch schedules
    const schedules = await prisma.schedule.findMany({ where: { eventId, ...(statusStr ? { status: statusStr } : {}) } });
    // Fetch deliverables
    const deliverables = await prisma.deliverable.findMany({ where: { eventId, ...(statusStr ? { status: statusStr } : {}) } });
    // Fetch payments (no status, but include as type)
    const payments = await prisma.payment.findMany({ where: { eventId } });
    // Fetch section items (if they have status)
    const sections = await prisma.section.findMany({ where: { eventId }, include: { items: true } });
    const sectionItems = sections.flatMap(section => section.items.map(item => ({ ...item, sectionName: section.name })));
    // Aggregate logs
    const logs = [
      ...schedules.map(s => ({
        type: 'schedule',
        id: s.id,
        status: s.status,
        description: s.description,
        date: s.date,
        forType: s.forType,
        forId: s.forId,
      })),
      ...deliverables.map(d => ({
        type: 'deliverable',
        id: d.id,
        status: d.status,
        name: d.name,
        description: d.description,
        date: d.date,
        vendorId: d.vendorId,
      })),
      ...payments.map(p => ({
        type: 'payment',
        id: p.id,
        amount: p.amount,
        paidAt: p.paidAt,
      })),
      ...sectionItems
        .filter(item => !statusStr || item.status === statusStr)
        .map(item => ({
          type: 'sectionItem',
          id: item.id,
          status: item.status,
          name: item.name,
          description: item.description,
          phone: item.phone,
          email: item.email,
          sectionName: item.sectionName,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
    ];
    // Sort logs by date/createdAt/paidAt/updatedAt (descending)
    logs.sort((a, b) => {
      const getDate = (x: any) => x.date || x.paidAt || x.createdAt || x.updatedAt || 0;
      return new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime();
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate activity logs', details: err });
  }
} 