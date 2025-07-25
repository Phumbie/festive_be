"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
router.get('/analytics', analyticsController_1.getGlobalAnalytics);
router.get('/:eventId/analytics', analyticsController_1.getEventAnalytics);
exports.default = router;
