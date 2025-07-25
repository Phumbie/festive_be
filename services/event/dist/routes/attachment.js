"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attachmentController_1 = require("../controllers/attachmentController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/attachments/' });
const router = (0, express_1.Router)();
router.post('/:eventId/attachments', attachmentController_1.addAttachment);
router.get('/:eventId/attachments', attachmentController_1.listAttachments);
router.delete('/:eventId/attachments/:attachmentId', attachmentController_1.deleteAttachment);
router.post('/:eventId/attachments/upload', upload.single('file'), attachmentController_1.uploadFile);
exports.default = router;
