import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentCreateDTO, PaymentUpdateDTO, PaymentResponse } from '../types/payment';

const prisma = new PrismaClient();

function toPaymentResponse(payment: any): PaymentResponse {
  return {
    ...payment,
    paidAt: payment.paidAt instanceof Date ? payment.paidAt.toISOString() : payment.paidAt,
    createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : payment.createdAt,
  };
}

export async function addPayment(req: Request<{ eventId: string }, {}, PaymentCreateDTO>, res: Response<PaymentResponse>) {
  try {
    const { amount, paidAt } = req.body;
    const payment = await prisma.payment.create({
      data: {
        eventId: req.params.eventId,
        amount,
        paidAt,
      },
    });
    res.status(201).json(toPaymentResponse(payment));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add payment', details: err } as any);
  }
}

export async function listPayments(req: Request<{ eventId: string }>, res: Response<PaymentResponse[]>) {
  try {
    const payments = await prisma.payment.findMany({
      where: { eventId: req.params.eventId },
    });
    res.json(payments.map(toPaymentResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list payments', details: err } as any);
  }
}

export async function updatePayment(req: Request<{ eventId: string; paymentId: string }, {}, PaymentUpdateDTO>, res: Response<PaymentResponse>) {
  try {
    const { amount, paidAt } = req.body;
    const payment = await prisma.payment.update({
      where: { id: req.params.paymentId },
      data: { amount, paidAt },
    });
    res.json(toPaymentResponse(payment));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment', details: err } as any);
  }
}

export async function deletePayment(req: Request<{ eventId: string; paymentId: string }>, res: Response) {
  try {
    await prisma.payment.delete({ where: { id: req.params.paymentId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment', details: err } as any);
  }
} 