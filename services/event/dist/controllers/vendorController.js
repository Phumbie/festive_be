"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVendorToEvent = addVendorToEvent;
exports.listEventVendors = listEventVendors;
exports.updateEventVendor = updateEventVendor;
exports.removeVendorFromEvent = removeVendorFromEvent;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toVendorResponse(vendor) {
    return {
        ...vendor,
        createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
        updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
    };
}
async function addVendorToEvent(req, res) {
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add vendor to event', details: err });
    }
}
async function listEventVendors(req, res) {
    try {
        const vendors = await prisma.eventVendor.findMany({
            where: { eventId: req.params.eventId },
            include: { vendor: true },
        });
        res.json(vendors.map(ev => ({ ...ev, vendor: toVendorResponse(ev.vendor) })));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list event vendors', details: err });
    }
}
async function updateEventVendor(req, res) {
    try {
        const { price, amount, paymentStatus } = req.body;
        const eventVendor = await prisma.eventVendor.update({
            where: { id: req.params.vendorId },
            data: { price, amount, paymentStatus },
        });
        res.json(eventVendor);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update event vendor', details: err });
    }
}
async function removeVendorFromEvent(req, res) {
    try {
        await prisma.eventVendor.delete({ where: { id: req.params.vendorId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to remove vendor from event', details: err });
    }
}
