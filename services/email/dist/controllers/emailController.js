"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const sendEmailSchema = joi_1.default.object({
    to: joi_1.default.alternatives().try(joi_1.default.string().email().required(), joi_1.default.array().items(joi_1.default.string().email()).min(1).required()),
    subject: joi_1.default.string().required(),
    template: joi_1.default.string().required(),
    data: joi_1.default.object().required(),
    attachments: joi_1.default.array().items(joi_1.default.object({
        filename: joi_1.default.string().required(),
        content: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.binary()),
        contentType: joi_1.default.string(),
        path: joi_1.default.string(),
    })),
    cc: joi_1.default.array().items(joi_1.default.string().email()),
    bcc: joi_1.default.array().items(joi_1.default.string().email()),
    replyTo: joi_1.default.string().email(),
});
const userRegistrationSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    verificationUrl: joi_1.default.string().uri().required(),
});
const emailVerificationSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    verificationUrl: joi_1.default.string().uri().required(),
});
const passwordResetSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    resetUrl: joi_1.default.string().uri().required(),
    expiryHours: joi_1.default.number().integer().min(1).max(72).default(24),
});
const userInvitationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    inviterName: joi_1.default.string().required(),
    roleName: joi_1.default.string().required(),
    acceptUrl: joi_1.default.string().uri().required(),
    expiryHours: joi_1.default.number().integer().min(1).max(168).default(72),
});
const eventInvitationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    eventName: joi_1.default.string().required(),
    eventDate: joi_1.default.string().required(),
    eventLocation: joi_1.default.string().required(),
    inviterName: joi_1.default.string().required(),
    acceptUrl: joi_1.default.string().uri().required(),
    declineUrl: joi_1.default.string().uri().required(),
});
const eventReminderSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    eventName: joi_1.default.string().required(),
    eventDate: joi_1.default.string().required(),
    eventLocation: joi_1.default.string().required(),
    clientName: joi_1.default.string().required(),
    daysUntilEvent: joi_1.default.number().integer().min(0).required(),
});
const invoiceSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    invoiceNumber: joi_1.default.string().required(),
    clientName: joi_1.default.string().required(),
    total: joi_1.default.number().positive().required(),
    currency: joi_1.default.string().length(3).required(),
    dueDate: joi_1.default.string().required(),
    downloadUrl: joi_1.default.string().uri().required(),
});
const paymentReminderSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    invoiceNumber: joi_1.default.string().required(),
    clientName: joi_1.default.string().required(),
    amount: joi_1.default.number().positive().required(),
    currency: joi_1.default.string().length(3).required(),
    dueDate: joi_1.default.string().required(),
    overdueDays: joi_1.default.number().integer().min(0).default(0),
    paymentUrl: joi_1.default.string().uri().required(),
});
const vendorAssignmentSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    vendorName: joi_1.default.string().required(),
    eventName: joi_1.default.string().required(),
    eventDate: joi_1.default.string().required(),
    eventLocation: joi_1.default.string().required(),
    services: joi_1.default.array().items(joi_1.default.string()).min(1).required(),
    contactPerson: joi_1.default.string().required(),
});
const deliverableReminderSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    deliverableName: joi_1.default.string().required(),
    eventName: joi_1.default.string().required(),
    dueDate: joi_1.default.string().required(),
    vendorName: joi_1.default.string().required(),
    daysUntilDue: joi_1.default.number().integer().min(0).required(),
});
class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendEmail(req, res) {
        try {
            const { error, value } = sendEmailSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendEmail(value);
            res.status(200).json({
                success: true,
                message: 'Email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendUserRegistration(req, res) {
        try {
            const { error, value } = userRegistrationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendUserRegistration(value);
            res.status(200).json({
                success: true,
                message: 'User registration email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send user registration email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send user registration email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendEmailVerification(req, res) {
        try {
            const { error, value } = emailVerificationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendEmailVerification(value);
            res.status(200).json({
                success: true,
                message: 'Email verification sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send email verification', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send email verification',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendPasswordReset(req, res) {
        try {
            const { error, value } = passwordResetSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendPasswordReset(value);
            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send password reset email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send password reset email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendUserInvitation(req, res) {
        try {
            const { error, value } = userInvitationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendUserInvitation(value);
            res.status(200).json({
                success: true,
                message: 'User invitation email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send user invitation email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send user invitation email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendEventInvitation(req, res) {
        try {
            const { error, value } = eventInvitationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendEventInvitation(value);
            res.status(200).json({
                success: true,
                message: 'Event invitation email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send event invitation email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send event invitation email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendEventReminder(req, res) {
        try {
            const { error, value } = eventReminderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendEventReminder(value);
            res.status(200).json({
                success: true,
                message: 'Event reminder email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send event reminder email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send event reminder email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendInvoice(req, res) {
        try {
            const { error, value } = invoiceSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendInvoice(value);
            res.status(200).json({
                success: true,
                message: 'Invoice email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send invoice email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send invoice email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendPaymentReminder(req, res) {
        try {
            const { error, value } = paymentReminderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendPaymentReminder(value);
            res.status(200).json({
                success: true,
                message: 'Payment reminder email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send payment reminder email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send payment reminder email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendVendorAssignment(req, res) {
        try {
            const { error, value } = vendorAssignmentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendVendorAssignment(value);
            res.status(200).json({
                success: true,
                message: 'Vendor assignment email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send vendor assignment email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send vendor assignment email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async sendDeliverableReminder(req, res) {
        try {
            const { error, value } = deliverableReminderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message),
                });
            }
            const result = await this.emailService.sendDeliverableReminder(value);
            res.status(200).json({
                success: true,
                message: 'Deliverable reminder email sent successfully',
                data: result,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to send deliverable reminder email', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to send deliverable reminder email',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async getStats(req, res) {
        try {
            const stats = this.emailService.getStats();
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get email stats', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to get email statistics',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async getLogs(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const logs = this.emailService.getLogs(limit);
            res.status(200).json({
                success: true,
                data: logs,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get email logs', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to get email logs',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async getLogById(req, res) {
        try {
            const { id } = req.params;
            const log = this.emailService.getLogById(id);
            if (!log) {
                return res.status(404).json({
                    success: false,
                    message: 'Email log not found',
                });
            }
            res.status(200).json({
                success: true,
                data: log,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get email log by ID', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to get email log',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async getTemplates(req, res) {
        try {
            const templates = this.emailService.getAvailableTemplates();
            res.status(200).json({
                success: true,
                data: templates,
            });
        }
        catch (error) {
            logger_1.default.error('Failed to get templates', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to get templates',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async testConnection(req, res) {
        try {
            const isConnected = await this.emailService.testConnection();
            res.status(200).json({
                success: true,
                data: {
                    connected: isConnected,
                },
            });
        }
        catch (error) {
            logger_1.default.error('Failed to test email connection', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to test email connection',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async clearLogs(req, res) {
        try {
            this.emailService.clearLogs();
            res.status(200).json({
                success: true,
                message: 'Email logs cleared successfully',
            });
        }
        catch (error) {
            logger_1.default.error('Failed to clear email logs', { error });
            res.status(500).json({
                success: false,
                message: 'Failed to clear email logs',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
exports.default = EmailController;
//# sourceMappingURL=emailController.js.map