import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  InvoiceCreateDTO,
  InvoiceUpdateDTO,
  InvoiceResponse,
  InvoiceItemCreateDTO,
  InvoiceItemUpdateDTO,
  InvoiceItemResponse
} from '../types/invoice';

const prisma = new PrismaClient();

function toInvoiceItemResponse(item: any): InvoiceItemResponse {
  return {
    ...item,
  };
}

function toInvoiceResponse(invoice: any): InvoiceResponse {
  return {
    ...invoice,
    date: invoice.date instanceof Date ? invoice.date.toISOString() : invoice.date,
    createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : invoice.createdAt,
    updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : invoice.updatedAt,
    items: invoice.items ? invoice.items.map(toInvoiceItemResponse) : [],
  };
}

export async function createInvoice(req: Request<{}, {}, InvoiceCreateDTO>, res: Response<InvoiceResponse>) {
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to create invoice', details: err } as any);
  }
}

export async function getInvoice(req: Request<{ id: string }>, res: Response<InvoiceResponse | { error: string }>) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(toInvoiceResponse(invoice));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get invoice', details: err } as any);
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
export async function updateInvoice(req: Request<{ id: string }, {}, InvoiceUpdateDTO>, res: Response<InvoiceResponse>) {
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to update invoice', details: err } as any);
  }
}

export async function deleteInvoice(req: Request<{ id: string }>, res: Response) {
  try {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice', details: err } as any);
  }
}

export async function listInvoices(_req: Request, res: Response<InvoiceResponse[]>) {
  try {
    const invoices = await prisma.invoice.findMany({ include: { items: true } });
    res.json(invoices.map(toInvoiceResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list invoices', details: err } as any);
  }
}

export async function addInvoiceItem(req: Request<{ id: string }, {}, InvoiceItemCreateDTO>, res: Response<InvoiceItemResponse>) {
  try {
    const item = await prisma.invoiceItem.create({
      data: {
        invoiceId: req.params.id,
        ...req.body,
      },
    });
    res.status(201).json(toInvoiceItemResponse(item));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add invoice item', details: err } as any);
  }
}

export async function updateInvoiceItem(req: Request<{ id: string; itemId: string }, {}, InvoiceItemUpdateDTO>, res: Response<InvoiceItemResponse>) {
  try {
    const item = await prisma.invoiceItem.update({
      where: { id: req.params.itemId },
      data: req.body,
    });
    res.json(toInvoiceItemResponse(item));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update invoice item', details: err } as any);
  }
}

export async function deleteInvoiceItem(req: Request<{ id: string; itemId: string }>, res: Response) {
  try {
    await prisma.invoiceItem.delete({ where: { id: req.params.itemId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice item', details: err } as any);
  }
} 