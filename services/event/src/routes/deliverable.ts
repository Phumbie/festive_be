import { Router } from 'express';
import {
  addDeliverable,
  listDeliverables,
  updateDeliverable,
  deleteDeliverable
} from '../controllers/deliverableController';

const router = Router();

router.post('/:eventId/vendors/:vendorId/deliverables', addDeliverable);
router.get('/:eventId/vendors/:vendorId/deliverables', listDeliverables);
router.put('/:eventId/vendors/:vendorId/deliverables/:deliverableId', updateDeliverable);
router.delete('/:eventId/vendors/:vendorId/deliverables/:deliverableId', deleteDeliverable);

export default router; 