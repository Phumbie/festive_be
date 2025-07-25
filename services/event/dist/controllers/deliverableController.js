"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeliverable = addDeliverable;
exports.listDeliverables = listDeliverables;
exports.updateDeliverable = updateDeliverable;
exports.deleteDeliverable = deleteDeliverable;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toDeliverableResponse(deliverable) {
    return {
        ...deliverable,
        date: deliverable.date instanceof Date ? deliverable.date.toISOString() : deliverable.date,
        createdAt: deliverable.createdAt instanceof Date ? deliverable.createdAt.toISOString() : deliverable.createdAt,
    };
}
async function addDeliverable(req, res) {
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add deliverable', details: err });
    }
}
async function listDeliverables(req, res) {
    try {
        const { status, startDate, endDate } = req.query;
        const where = {
            eventId: req.params.eventId,
            vendorId: req.params.vendorId,
        };
        if (status)
            where.status = status;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const deliverables = await prisma.deliverable.findMany({
            where,
        });
        res.json(deliverables.map(toDeliverableResponse));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list deliverables', details: err });
    }
}
async function updateDeliverable(req, res) {
    try {
        const { name, description, date, status } = req.body;
        const deliverable = await prisma.deliverable.update({
            where: { id: req.params.deliverableId },
            data: { name, description, date, status },
        });
        res.json(toDeliverableResponse(deliverable));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update deliverable', details: err });
    }
}
async function deleteDeliverable(req, res) {
    try {
        await prisma.deliverable.delete({ where: { id: req.params.deliverableId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete deliverable', details: err });
    }
}
