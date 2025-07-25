import { Router } from 'express';
import {
  addPayment,
  listPayments,
  updatePayment,
  deletePayment
} from '../controllers/paymentController';

const router = Router();

router.post('/:eventId/payments', addPayment);
router.get('/:eventId/payments', listPayments);
router.put('/:eventId/payments/:paymentId', updatePayment);
router.delete('/:eventId/payments/:paymentId', deletePayment);

export default router; 