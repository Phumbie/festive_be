"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = __importDefault(require("../controllers/emailController"));
const emailService_1 = __importDefault(require("../services/emailService"));
const createEmailConfig = () => ({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@festive.com',
    replyTo: process.env.EMAIL_REPLY_TO,
});
const createEmailRouter = () => {
    const router = (0, express_1.Router)();
    const emailConfig = createEmailConfig();
    const emailService = new emailService_1.default(emailConfig);
    const emailController = new emailController_1.default(emailService);
    setTimeout(() => {
        console.log('Email service initialized and ready');
    }, 1000);
    router.post('/send', emailController.sendEmail.bind(emailController));
    router.post('/user-registration', emailController.sendUserRegistration.bind(emailController));
    router.post('/email-verification', emailController.sendEmailVerification.bind(emailController));
    router.post('/password-reset', emailController.sendPasswordReset.bind(emailController));
    router.post('/user-invitation', emailController.sendUserInvitation.bind(emailController));
    router.post('/event-invitation', emailController.sendEventInvitation.bind(emailController));
    router.post('/event-reminder', emailController.sendEventReminder.bind(emailController));
    router.post('/invoice', emailController.sendInvoice.bind(emailController));
    router.post('/payment-reminder', emailController.sendPaymentReminder.bind(emailController));
    router.post('/vendor-assignment', emailController.sendVendorAssignment.bind(emailController));
    router.post('/deliverable-reminder', emailController.sendDeliverableReminder.bind(emailController));
    router.get('/stats', emailController.getStats.bind(emailController));
    router.get('/logs', emailController.getLogs.bind(emailController));
    router.get('/logs/:id', emailController.getLogById.bind(emailController));
    router.get('/templates', emailController.getTemplates.bind(emailController));
    router.get('/test-connection', emailController.testConnection.bind(emailController));
    router.delete('/logs', emailController.clearLogs.bind(emailController));
    return router;
};
exports.default = createEmailRouter();
//# sourceMappingURL=email.js.map