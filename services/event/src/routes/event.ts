import { Router } from 'express';
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  addSection,
  deleteSection,
  addSectionItem,
  deleteSectionItem
} from '../controllers/eventController';

const router = Router();

router.post('/', createEvent);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Section endpoints
router.post('/:id/sections', addSection);
router.delete('/:id/sections/:sectionId', deleteSection);

// Section item endpoints
router.post('/:id/sections/:sectionId/items', addSectionItem);
router.delete('/:id/sections/:sectionId/items/:itemId', deleteSectionItem);

export default router; 