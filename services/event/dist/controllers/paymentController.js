"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = addPayment;
exports.listPayments = listPayments;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function toPaymentResponse(payment) {
    return {
        ...payment,
        paidAt: payment.paidAt instanceof Date ? payment.paidAt.toISOString() : payment.paidAt,
        createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : payment.createdAt,
    };
}
async function addPayment(req, res) {
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add payment', details: err });
    }
}
async function listPayments(req, res) {
    try {
        const payments = await prisma.payment.findMany({
            where: { eventId: req.params.eventId },
        });
        res.json(payments.map(toPaymentResponse));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list payments', details: err });
    }
}
async function updatePayment(req, res) {
    try {
        const { amount, paidAt } = req.body;
        const payment = await prisma.payment.update({
            where: { id: req.params.paymentId },
            data: { amount, paidAt },
        });
        res.json(toPaymentResponse(payment));
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update payment', details: err });
    }
}
async function deletePayment(req, res) {
    try {
        await prisma.payment.delete({ where: { id: req.params.paymentId } });
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete payment', details: err });
    }
}
