import { Router } from 'express';
import {
  addAttachment,
  listAttachments,
  deleteAttachment,
  uploadFile
} from '../controllers/attachmentController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/attachments/' });

const router = Router();

router.post('/:eventId/attachments', addAttachment);
router.get('/:eventId/attachments', listAttachments);
router.delete('/:eventId/attachments/:attachmentId', deleteAttachment);
router.post('/:eventId/attachments/upload', upload.single('file'), uploadFile);

export default router; 