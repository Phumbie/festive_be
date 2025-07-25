"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
router.get('/analytics', analyticsController_1.getAllVendorsAnalytics);
router.get('/:id/analytics', analyticsController_1.getVendorAnalytics);
exports.default = router;
