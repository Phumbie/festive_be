"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.listEvents = listEvents;
exports.addSection = addSection;
exports.deleteSection = deleteSection;
exports.addSectionItem = addSectionItem;
exports.deleteSectionItem = deleteSectionItem;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toEventResponse(event) {
    return {
        ...event,
        eventDate: event.eventDate instanceof Date ? event.eventDate.toISOString() : event.eventDate,
        createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
        updatedAt: event.updatedAt instanceof Date ? event.updatedAt.toISOString() : event.updatedAt,
    };
}
function toSectionResponse(section) {
    return {
        ...section,
        createdAt: section.createdAt instanceof Date ? section.createdAt.toISOString() : section.createdAt,
        updatedAt: section.updatedAt instanceof Date ? section.updatedAt.toISOString() : section.updatedAt,
    };
}
function toSectionItemResponse(item) {
    return {
        ...item,
        createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
    };
}
async function createEvent(req, res) {
    try {
        const event = await prisma.event.create({ data: req.body });
        res.status(201).json(toEventResponse(event));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create event', details: err });
    }
}
async function getEvent(req, res) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: { sections: { include: { items: true } } },
        });
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        res.json(toEventResponse(event));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get event', details: err });
    }
}
async function updateEvent(req, res) {
    try {
        const event = await prisma.event.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(toEventResponse(event));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update event', details: err });
    }
}
async function deleteEvent(req, res) {
    try {
        await prisma.event.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete event', details: err });
    }
}
async function listEvents(_req, res) {
    try {
        const events = await prisma.event.findMany({ include: { sections: true } });
        res.json(events.map(toEventResponse));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list events', details: err });
    }
}
async function addSection(req, res) {
    try {
        const section = await prisma.section.create({
            data: {
                eventId: req.params.id,
                name: req.body.name,
            },
        });
        res.status(201).json(toSectionResponse(section));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add section', details: err });
    }
}
async function deleteSection(req, res) {
    try {
        await prisma.section.delete({ where: { id: req.params.sectionId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete section', details: err });
    }
}
async function addSectionItem(req, res) {
    try {
        const item = await prisma.sectionItem.create({
            data: {
                sectionId: req.params.sectionId,
                ...req.body,
            },
        });
        res.status(201).json(toSectionItemResponse(item));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add section item', details: err });
    }
}
async function deleteSectionItem(req, res) {
    try {
        await prisma.sectionItem.delete({ where: { id: req.params.itemId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete section item', details: err });
    }
}
