import { Router } from 'express';
import {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  addInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem
} from '../controllers/invoiceController';

const router = Router();

router.post('/', createInvoice);
router.get('/', listInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

// Invoice item endpoints
router.post('/:id/items', addInvoiceItem);
router.put('/:id/items/:itemId', updateInvoiceItem);
router.delete('/:id/items/:itemId', deleteInvoiceItem);

export default router; 