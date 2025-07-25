"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = createVendor;
exports.getVendor = getVendor;
exports.updateVendor = updateVendor;
exports.deleteVendor = deleteVendor;
exports.listVendors = listVendors;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toVendorResponse(vendor) {
    return {
        ...vendor,
        createdAt: vendor.createdAt instanceof Date ? vendor.createdAt.toISOString() : vendor.createdAt,
        updatedAt: vendor.updatedAt instanceof Date ? vendor.updatedAt.toISOString() : vendor.updatedAt,
    };
}
async function createVendor(req, res) {
    try {
        const vendor = await prisma.vendor.create({ data: req.body });
        res.status(201).json(toVendorResponse(vendor));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create vendor', details: err });
    }
}
async function getVendor(req, res) {
    try {
        const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } });
        if (!vendor)
            return res.status(404).json({ error: 'Vendor not found' });
        res.json(toVendorResponse(vendor));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get vendor', details: err });
    }
}
async function updateVendor(req, res) {
    try {
        const vendor = await prisma.vendor.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(toVendorResponse(vendor));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update vendor', details: err });
    }
}
async function deleteVendor(req, res) {
    try {
        await prisma.vendor.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete vendor', details: err });
    }
}
async function listVendors(_req, res) {
    try {
        const vendors = await prisma.vendor.findMany();
        res.json(vendors.map(toVendorResponse));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list vendors', details: err });
    }
}
