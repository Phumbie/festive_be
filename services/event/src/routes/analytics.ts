import { Router } from 'express';
import { getEventAnalytics, getGlobalAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/analytics', getGlobalAnalytics);
router.get('/:eventId/analytics', getEventAnalytics);

export default router; 