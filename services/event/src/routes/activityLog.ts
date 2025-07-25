import { Router } from 'express';
import { listActivityLogs } from '../controllers/activityLogController';

const router = Router();

router.get('/:eventId/activity-logs', listActivityLogs);

export default router; 