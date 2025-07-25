import { Router } from 'express';
import {
  addSchedule,
  listSchedules,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController';

const router = Router();

router.post('/:eventId/schedules', addSchedule);
router.get('/:eventId/schedules', listSchedules);
router.put('/:eventId/schedules/:scheduleId', updateSchedule);
router.delete('/:eventId/schedules/:scheduleId', deleteSchedule);

export default router; 