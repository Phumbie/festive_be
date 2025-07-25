import { Router } from 'express';
import {
  addVendorToEvent,
  listEventVendors,
  updateEventVendor,
  removeVendorFromEvent
} from '../controllers/vendorController';

const router = Router();

router.post('/:eventId/vendors', addVendorToEvent);
router.get('/:eventId/vendors', listEventVendors);
router.put('/:eventId/vendors/:vendorId', updateEventVendor);
router.delete('/:eventId/vendors/:vendorId', removeVendorFromEvent);

export default router; 