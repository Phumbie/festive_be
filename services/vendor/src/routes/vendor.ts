import { Router } from 'express';
import {
  createVendor,
  getVendor,
  updateVendor,
  deleteVendor,
  listVendors
} from '../controllers/vendorController';

const router = Router();

router.post('/', createVendor);
router.get('/', listVendors);
router.get('/:id', getVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router; 