import { Router } from 'express';
import { getAllVendorsAnalytics, getVendorAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/analytics', getAllVendorsAnalytics);
router.get('/:id/analytics', getVendorAnalytics);

export default router; 