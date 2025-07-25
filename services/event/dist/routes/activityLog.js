"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityLogController_1 = require("../controllers/activityLogController");
const router = (0, express_1.Router)();
router.get('/:eventId/activity-logs', activityLogController_1.listActivityLogs);
exports.default = router;
