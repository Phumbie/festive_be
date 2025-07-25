"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
router.post('/', eventController_1.createEvent);
router.get('/', eventController_1.listEvents);
router.get('/:id', eventController_1.getEvent);
router.put('/:id', eventController_1.updateEvent);
router.delete('/:id', eventController_1.deleteEvent);
// Section endpoints
router.post('/:id/sections', eventController_1.addSection);
router.delete('/:id/sections/:sectionId', eventController_1.deleteSection);
// Section item endpoints
router.post('/:id/sections/:sectionId/items', eventController_1.addSectionItem);
router.delete('/:id/sections/:sectionId/items/:itemId', eventController_1.deleteSectionItem);
exports.default = router;
