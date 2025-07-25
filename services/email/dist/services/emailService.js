"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const uuid_1 = require("uuid");
const templates_1 = require("../templates");
const logger_1 = __importDefault(require("../utils/logger"));
class EmailService {
    constructor(config) {
        this.emailLogs = [];
        this.isEthereal = false;
        this.config = config;
        this.initializeTransporter();
    }
    async initializeTransporter() {
        try {
            logger_1.default.info('Email configuration:', {
                host: this.config.host,
                port: this.config.port,
                secure: this.config.secure,
                auth: {
                    user: this.config.auth.user,
                    pass: this.config.auth.pass ? '[HIDDEN]' : '[EMPTY]'
                }
            });
            if (this.config.host === 'ethereal' || this.config.host === 'smtp.ethereal.email') {
                this.isEthereal = true;
                const testAccount = await nodemailer_1.default.createTestAccount();
                logger_1.default.info('Ethereal test account created:', {
                    user: testAccount.user,
                    pass: testAccount.pass,
                    smtp: testAccount.smtp
                });
                this.transporter = nodemailer_1.default.createTransport({
                    host: testAccount.smtp.host,
                    port: testAccount.smtp.port,
                    secure: testAccount.smtp.secure,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                logger_1.default.info('Ethereal transporter initialized successfully');
            }
            else {
                this.transporter = nodemailer_1.default.createTransport({
                    host: this.config.host,
                    port: this.config.port,
                    secure: this.config.secure,
                    auth: {
                        user: this.config.auth.user,
                        pass: this.config.auth.pass,
                    },
                });
                logger_1.default.info('SMTP transporter initialized successfully');
            }
        }
        catch (error) {
            logger_1.default.error('Failed to initialize email transporter:', error);
            throw error;
        }
    }
    async sendEmail(request) {
        const logId = (0, uuid_1.v4)();
        const log = {
            id: logId,
            to: Array.isArray(request.to) ? request.to.join(', ') : request.to,
            subject: request.subject,
            template: request.template,
            status: 'pending',
            createdAt: new Date(),
        };
        try {
            const template = (0, templates_1.getTemplate)(request.template);
            if (!template) {
                throw new Error(`Template '${request.template}' not found`);
            }
            const compiledHtml = handlebars_1.default.compile(template.html);
            const compiledText = template.text ? handlebars_1.default.compile(template.text) : null;
            const htmlContent = compiledHtml(request.data);
            const textContent = compiledText ? compiledText(request.data) : null;
            const mailOptions = {
                from: this.config.from,
                to: request.to,
                subject: request.subject,
                html: htmlContent,
                text: textContent || undefined,
                cc: request.cc,
                bcc: request.bcc,
                replyTo: request.replyTo || this.config.replyTo,
                attachments: request.attachments,
            };
            const result = await this.transporter.sendMail(mailOptions);
            log.status = 'sent';
            log.messageId = result.messageId;
            log.sentAt = new Date();
            const response = {
                messageId: result.messageId,
                accepted: result.accepted || [],
                rejected: result.rejected || [],
                response: result.response || '',
                success: true,
            };
            if (this.isEthereal) {
                const previewUrl = nodemailer_1.default.getTestMessageUrl(result);
                if (previewUrl) {
                    logger_1.default.info(`Ethereal email preview URL: ${previewUrl}`);
                    response.previewUrl = previewUrl;
                }
            }
            logger_1.default.info(`Email sent successfully: ${logId}`, {
                template: request.template,
                to: request.to,
                messageId: result.messageId,
                previewUrl: response.previewUrl,
            });
            return response;
        }
        catch (error) {
            log.status = 'failed';
            log.error = error instanceof Error ? error.message : 'Unknown error';
            logger_1.default.error(`Email sending failed: ${logId}`, {
                template: request.template,
                to: request.to,
                error: log.error,
            });
            throw error;
        }
        finally {
            this.emailLogs.push(log);
        }
    }
    async sendUserRegistration(data) {
        const template = (0, templates_1.getTemplate)('user-registration');
        if (!template) {
            throw new Error('User registration template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject,
            template: 'user-registration',
            data,
        });
    }
    async sendEmailVerification(data) {
        const template = (0, templates_1.getTemplate)('email-verification');
        if (!template) {
            throw new Error('Email verification template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject,
            template: 'email-verification',
            data,
        });
    }
    async sendPasswordReset(data) {
        const template = (0, templates_1.getTemplate)('password-reset');
        if (!template) {
            throw new Error('Password reset template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject,
            template: 'password-reset',
            data,
        });
    }
    async sendUserInvitation(data) {
        const template = (0, templates_1.getTemplate)('user-invitation');
        if (!template) {
            throw new Error('User invitation template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject,
            template: 'user-invitation',
            data,
        });
    }
    async sendEventInvitation(data) {
        const template = (0, templates_1.getTemplate)('event-invitation');
        if (!template) {
            throw new Error('Event invitation template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject.replace('{{eventName}}', data.eventName),
            template: 'event-invitation',
            data,
        });
    }
    async sendEventReminder(data) {
        const template = (0, templates_1.getTemplate)('event-reminder');
        if (!template) {
            throw new Error('Event reminder template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject
                .replace('{{eventName}}', data.eventName)
                .replace('{{daysUntilEvent}}', data.daysUntilEvent.toString()),
            template: 'event-reminder',
            data,
        });
    }
    async sendInvoice(data) {
        const template = (0, templates_1.getTemplate)('invoice-sent');
        if (!template) {
            throw new Error('Invoice template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject
                .replace('{{invoiceNumber}}', data.invoiceNumber)
                .replace('{{clientName}}', data.clientName),
            template: 'invoice-sent',
            data,
        });
    }
    async sendPaymentReminder(data) {
        const template = (0, templates_1.getTemplate)('payment-reminder');
        if (!template) {
            throw new Error('Payment reminder template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject.replace('{{invoiceNumber}}', data.invoiceNumber),
            template: 'payment-reminder',
            data,
        });
    }
    async sendVendorAssignment(data) {
        const template = (0, templates_1.getTemplate)('vendor-assignment');
        if (!template) {
            throw new Error('Vendor assignment template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject.replace('{{eventName}}', data.eventName),
            template: 'vendor-assignment',
            data,
        });
    }
    async sendDeliverableReminder(data) {
        const template = (0, templates_1.getTemplate)('deliverable-reminder');
        if (!template) {
            throw new Error('Deliverable reminder template not found');
        }
        return this.sendEmail({
            to: data.email,
            subject: template.subject.replace('{{deliverableName}}', data.deliverableName),
            template: 'deliverable-reminder',
            data,
        });
    }
    getStats() {
        const total = this.emailLogs.length;
        const sent = this.emailLogs.filter(log => log.status === 'sent').length;
        const failed = this.emailLogs.filter(log => log.status === 'failed').length;
        const pending = this.emailLogs.filter(log => log.status === 'pending').length;
        return {
            sent,
            failed,
            pending,
            total,
        };
    }
    getLogs(limit = 100) {
        return this.emailLogs
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit);
    }
    getLogById(id) {
        return this.emailLogs.find(log => log.id === id) || null;
    }
    clearLogs() {
        this.emailLogs = [];
    }
    async testConnection() {
        try {
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            logger_1.default.error('Email service connection test failed', { error });
            return false;
        }
    }
    getAvailableTemplates() {
        return [
            'user-registration',
            'email-verification',
            'password-reset',
            'user-invitation',
            'event-invitation',
            'event-reminder',
            'invoice-sent',
            'payment-reminder',
            'vendor-assignment',
            'deliverable-reminder',
        ];
    }
    isUsingEthereal() {
        return this.isEthereal;
    }
}
exports.default = EmailService;
//# sourceMappingURL=emailService.js.map