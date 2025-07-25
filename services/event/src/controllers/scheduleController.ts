import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScheduleCreateDTO, ScheduleUpdateDTO, ScheduleResponse } from '../types/schedule';

const prisma = new PrismaClient();

function toScheduleResponse(schedule: any): ScheduleResponse {
  return {
    ...schedule,
    date: schedule.date instanceof Date ? schedule.date.toISOString() : schedule.date,
    createdAt: schedule.createdAt instanceof Date ? schedule.createdAt.toISOString() : schedule.createdAt,
  };
}

export async function addSchedule(req: Request<{ eventId: string }, {}, ScheduleCreateDTO>, res: Response<ScheduleResponse>) {
  try {
    const schedule = await prisma.schedule.create({
      data: {
        eventId: req.params.eventId,
        ...req.body,
      },
    });
    res.status(201).json(toScheduleResponse(schedule));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add schedule', details: err } as any);
  }
}

export async function listSchedules(req: Request<{ eventId: string }>, res: Response<ScheduleResponse[]>) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { eventId: req.params.eventId },
    });
    res.json(schedules.map(toScheduleResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list schedules', details: err } as any);
  }
}

export async function updateSchedule(req: Request<{ eventId: string; scheduleId: string }, {}, ScheduleUpdateDTO>, res: Response<ScheduleResponse>) {
  try {
    const schedule = await prisma.schedule.update({
      where: { id: req.params.scheduleId },
      data: req.body,
    });
    res.json(toScheduleResponse(schedule));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update schedule', details: err } as any);
  }
}

export async function deleteSchedule(req: Request<{ eventId: string; scheduleId: string }>, res: Response) {
  try {
    await prisma.schedule.delete({ where: { id: req.params.scheduleId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete schedule', details: err } as any);
  }
} 