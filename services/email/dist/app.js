"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const email_1 = __importDefault(require("./routes/email"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Email service is running',
        timestamp: new Date().toISOString(),
        service: 'email-service',
        version: '1.0.0',
    });
});
app.use('/api/email', email_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});
app.use((error, req, res, next) => {
    logger_1.default.error('Unhandled error', { error: error.message, stack: error.stack });
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
});
app.listen(PORT, () => {
    logger_1.default.info(`Email service started on port ${PORT}`);
    logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map