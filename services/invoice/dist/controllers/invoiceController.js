"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = createInvoice;
exports.getInvoice = getInvoice;
exports.updateInvoice = updateInvoice;
exports.deleteInvoice = deleteInvoice;
exports.listInvoices = listInvoices;
exports.addInvoiceItem = addInvoiceItem;
exports.updateInvoiceItem = updateInvoiceItem;
exports.deleteInvoiceItem = deleteInvoiceItem;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toInvoiceItemResponse(item) {
    return {
        ...item,
    };
}
function toInvoiceResponse(invoice) {
    return {
        ...invoice,
        date: invoice.date instanceof Date ? invoice.date.toISOString() : invoice.date,
        createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : invoice.createdAt,
        updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : invoice.updatedAt,
        items: invoice.items ? invoice.items.map(toInvoiceItemResponse) : [],
    };
}
async function createInvoice(req, res) {
    try {
        const invoice = await prisma.invoice.create({
            data: {
                ...req.body,
                date: new Date(req.body.date),
                items: req.body.items ? { create: req.body.items } : undefined,
            },
            include: { items: true },
        });
        res.status(201).json(toInvoiceResponse(invoice));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create invoice', details: err });
    }
}
async function getInvoice(req, res) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: req.params.id },
            include: { items: true },
        });
        if (!invoice)
            return res.status(404).json({ error: 'Invoice not found' });
        res.json(toInvoiceResponse(invoice));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get invoice', details: err });
    }
}
/**
 * Update an invoice and optionally its items.
 *
 * To update scalar fields (e.g., status, total), include them directly in the request body.
 * To update items, use Prisma's nested update syntax:
 *
 * Example request body:
 * {
 *   "status": "paid",
 *   "total": 5000,
 *   "items": {
 *     "update": [
 *       { "where": { "id": "existing-item-id" }, "data": { "amount": 2000 } }
 *     ],
 *     "create": [
 *       { "name": "New Service", "quantity": 1, "amount": 3000 }
 *     ],
 *     "delete": [
 *       { "id": "item-to-delete-id" }
 *     ]
 *   }
 * }
 *
 * Only include the 'items' field if you want to update, create, or delete invoice items.
 */
async function updateInvoice(req, res) {
    try {
        const { items, ...rest } = req.body;
        const invoice = await prisma.invoice.update({
            where: { id: req.params.id },
            data: {
                ...rest,
                date: req.body.date ? new Date(req.body.date) : undefined,
                // If you want to support nested item updates, use Prisma's nested update syntax here
            },
            include: { items: true },
        });
        res.json(toInvoiceResponse(invoice));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update invoice', details: err });
    }
}
async function deleteInvoice(req, res) {
    try {
        await prisma.invoice.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete invoice', details: err });
    }
}
async function listInvoices(_req, res) {
    try {
        const invoices = await prisma.invoice.findMany({ include: { items: true } });
        res.json(invoices.map(toInvoiceResponse));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list invoices', details: err });
    }
}
async function addInvoiceItem(req, res) {
    try {
        const item = await prisma.invoiceItem.create({
            data: {
                invoiceId: req.params.id,
                ...req.body,
            },
        });
        res.status(201).json(toInvoiceItemResponse(item));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add invoice item', details: err });
    }
}
async function updateInvoiceItem(req, res) {
    try {
        const item = await prisma.invoiceItem.update({
            where: { id: req.params.itemId },
            data: req.body,
        });
        res.json(toInvoiceItemResponse(item));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update invoice item', details: err });
    }
}
async function deleteInvoiceItem(req, res) {
    try {
        await prisma.invoiceItem.delete({ where: { id: req.params.itemId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete invoice item', details: err });
    }
}
