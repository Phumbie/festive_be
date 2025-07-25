"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const event_1 = __importDefault(require("./routes/event"));
const vendor_1 = __importDefault(require("./routes/vendor"));
const schedule_1 = __importDefault(require("./routes/schedule"));
const attachment_1 = __importDefault(require("./routes/attachment"));
const payment_1 = __importDefault(require("./routes/payment"));
const deliverable_1 = __importDefault(require("./routes/deliverable"));
const activityLog_1 = __importDefault(require("./routes/activityLog"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const auth_1 = require("./middleware/auth");
console.log('CONTAINER BUILD TEST - EVENT SERVICE');
const app = (0, express_1.default)();
app.use((0, express_2.json)());
app.use((0, express_2.urlencoded)({ extended: true }));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'event' });
});
app.use(auth_1.authenticateJwt); // Require JWT for all routes
app.use('/events', event_1.default);
app.use('/events', vendor_1.default);
app.use('/events', schedule_1.default);
app.use('/events', attachment_1.default);
app.use('/events', payment_1.default);
app.use('/events', deliverable_1.default);
app.use('/events', activityLog_1.default);
app.use('/events', analytics_1.default);
exports.default = app;
