import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getEventAnalytics(req: Request, res: Response) {
  try {
    const eventId = req.params.eventId;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Countdown (days until event)
    const now = new Date();
    const countdown = Math.max(0, Math.ceil((event.eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Payments
    const payments = await prisma.payment.findMany({ where: { eventId } });
    const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const budgetRemaining = event.budget - amountPaid;

    // Vendors
    const vendorCount = await prisma.eventVendor.count({ where: { eventId } });

    // Deliverables
    const deliverableCount = await prisma.deliverable.count({ where: { eventId } });
    const completedDeliverables = await prisma.deliverable.count({ where: { eventId, status: 'completed' } });

    // Schedules
    const scheduleCount = await prisma.schedule.count({ where: { eventId } });
    const completedSchedules = await prisma.schedule.count({ where: { eventId, status: 'completed' } });

    // Attachments
    const attachmentCount = await prisma.attachment.count({ where: { eventId } });

    // Upcoming schedules for this event
    const upcomingSchedules = await prisma.schedule.findMany({
      where: {
        eventId,
        date: { gt: now },
      },
      orderBy: { date: 'asc' },
    });

    res.json({
      eventId,
      eventName: event.name,
      countdown,
      budget: event.budget,
      amountPaid,
      budgetRemaining,
      totalPayments: payments.length,
      totalVendors: vendorCount,
      totalDeliverables: deliverableCount,
      completedDeliverables,
      totalSchedules: scheduleCount,
      completedSchedules,
      totalAttachments: attachmentCount,
      currency: event.currency,
      eventDate: event.eventDate,
      allUpcomingSchedules: upcomingSchedules,
      allUpcomingSchedulesCount: upcomingSchedules.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get event analytics', details: err });
  }
}

export async function getGlobalAnalytics(_req: Request, res: Response) {
  try {
    const now = new Date();
    // Total events
    const totalEvents = await prisma.event.count();
    // Upcoming events
    const upcomingEvents = await prisma.event.findMany({ where: { eventDate: { gt: now } } });
    // Total budgets
    const allEvents = await prisma.event.findMany();
    const totalBudgets = allEvents.reduce((sum, e) => sum + (e.budget || 0), 0);
    // Total client payments
    const allPayments = await prisma.payment.findMany();
    const totalClientPayments = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    // Total outstanding (sum of all event budgets - payments)
    const totalOutstanding = totalBudgets - totalClientPayments;
    // Total invoices sent (to be fetched from invoice service in gateway)
    // All upcoming schedules
    const allUpcomingSchedules = await prisma.schedule.findMany({ where: { date: { gt: now } }, orderBy: { date: 'asc' } });
    // Compose response
    res.json({
      totalClientPayments,
      totalBudgets,
      totalOutstanding,
      totalEvents,
      totalUpcomingEvents: upcomingEvents.length,
      allUpcomingSchedules,
      allUpcomingSchedulesCount: allUpcomingSchedules.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get global analytics', details: err });
  }
} 