import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventCreateDTO, EventUpdateDTO, EventResponse } from '../types/event';

const prisma = new PrismaClient();

function toEventResponse(event: any): EventResponse {
  return {
    ...event,
    startDate: event.startDate instanceof Date ? event.startDate.toISOString() : event.startDate,
    endDate: event.endDate instanceof Date ? event.endDate.toISOString() : event.endDate,
    createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
    updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
  };
}

function toSectionResponse(section: any): SectionResponse {
  return {
    ...section,
    createdAt: section.createdAt instanceof Date ? section.createdAt.toISOString() : section.createdAt,
    updatedAt: section.updatedAt instanceof Date ? section.updatedAt.toISOString() : section.updatedAt,
  };
}

function toSectionItemResponse(item: any): SectionItemResponse {
  return {
    ...item,
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
    updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
  };
}

export async function createEvent(req: Request<{}, {}, EventCreateDTO>, res: Response<EventResponse>) {
  try {
    // Validate date range
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({ 
        error: 'End date must be after start date' 
      } as any);
    }

    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(toEventResponse(event));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event', details: err } as any);
  }
}

export async function getEvent(req: Request, res: Response<EventResponse | { error: string }>) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { sections: { include: { items: true } } },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(toEventResponse(event));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get event', details: err } as any);
  }
}

export async function updateEvent(req: Request<{ id: string }, {}, EventUpdateDTO>, res: Response<EventResponse>) {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(toEventResponse(event));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event', details: err } as any);
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event', details: err } as any);
  }
}

export async function listEvents(_req: Request, res: Response<EventResponse[]>) {
  try {
    const events = await prisma.event.findMany({ include: { sections: true } });
    res.json(events.map(toEventResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list events', details: err } as any);
  }
}

// Section endpoints (types for brevity)
import { SectionCreateDTO, SectionResponse, SectionItemCreateDTO, SectionItemResponse } from '../types/section';

export async function addSection(req: Request<{ id: string }, {}, SectionCreateDTO>, res: Response<SectionResponse>) {
  try {
    const section = await prisma.section.create({
      data: {
        eventId: req.params.id,
        name: req.body.name,
      },
    });
    res.status(201).json(toSectionResponse(section));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add section', details: err } as any);
  }
}

export async function deleteSection(req: Request<{ id: string; sectionId: string }>, res: Response) {
  try {
    await prisma.section.delete({ where: { id: req.params.sectionId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete section', details: err } as any);
  }
}

export async function addSectionItem(req: Request<{ id: string; sectionId: string }, {}, SectionItemCreateDTO>, res: Response<SectionItemResponse>) {
  try {
    const item = await prisma.sectionItem.create({
      data: {
        sectionId: req.params.sectionId,
        ...req.body,
      },
    });
    res.status(201).json(toSectionItemResponse(item));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add section item', details: err } as any);
  }
}

export async function deleteSectionItem(req: Request<{ id: string; sectionId: string; itemId: string }>, res: Response) {
  try {
    await prisma.sectionItem.delete({ where: { id: req.params.itemId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete section item', details: err } as any);
  }
} 