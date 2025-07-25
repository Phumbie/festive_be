import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
import { EmailRequest, EmailResponse, EmailConfig, EmailLog, EmailStats } from '../types/email';
import { getTemplate } from '../templates';
import logger from '../utils/logger';

class EmailService {
  private transporter!: nodemailer.Transporter;
  private emailLogs: EmailLog[] = [];
  private config: EmailConfig;
  private isEthereal: boolean = false;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // Debug: Log the configuration
      logger.info('Email configuration:', {
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.auth.user,
          pass: this.config.auth.pass ? '[HIDDEN]' : '[EMPTY]'
        }
      });
      
      // Check if we should use Ethereal
      if (this.config.host === 'ethereal' || this.config.host === 'smtp.ethereal.email') {
        this.isEthereal = true;
        
        // Create Ethereal test account automatically
        const testAccount = await nodemailer.createTestAccount();
        logger.info('Ethereal test account created:', {
          user: testAccount.user,
          pass: testAccount.pass,
          smtp: testAccount.smtp
        });
        
        this.transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        logger.info('Ethereal transporter initialized successfully');
      } else {
        // Use real SMTP config
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          auth: {
            user: this.config.auth.user,
            pass: this.config.auth.pass,
          },
        });
        
        logger.info('SMTP transporter initialized successfully');
      }
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
      throw error;
    }
  }

  /**
   * Send an email using a template
   */
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    const logId = uuidv4();
    const log: EmailLog = {
      id: logId,
      to: Array.isArray(request.to) ? request.to.join(', ') : request.to,
      subject: request.subject,
      template: request.template,
      status: 'pending',
      createdAt: new Date(),
    };

    try {
      // Get template
      const template = getTemplate(request.template);
      if (!template) {
        throw new Error(`Template '${request.template}' not found`);
      }

      // Compile template
      const compiledHtml = handlebars.compile(template.html);
      const compiledText = template.text ? handlebars.compile(template.text) : null;

      // Render content
      const htmlContent = compiledHtml(request.data);
      const textContent = compiledText ? compiledText(request.data) : null;

      // Prepare email options
      const mailOptions: nodemailer.SendMailOptions = {
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

      // Send email
      const result = await this.transporter.sendMail(mailOptions);

      // Update log
      log.status = 'sent';
      log.messageId = result.messageId;
      log.sentAt = new Date();

      const response: EmailResponse = {
        messageId: result.messageId,
        accepted: result.accepted || [],
        rejected: result.rejected || [],
        response: result.response || '',
        success: true,
      };

      // Log Ethereal preview URL if using Ethereal
      if (this.isEthereal) {
        const previewUrl = nodemailer.getTestMessageUrl(result);
        if (previewUrl) {
          logger.info(`Ethereal email preview URL: ${previewUrl}`);
          response.previewUrl = previewUrl;
        }
      }

      logger.info(`Email sent successfully: ${logId}`, {
        template: request.template,
        to: request.to,
        messageId: result.messageId,
        previewUrl: response.previewUrl,
      });

      return response;
    } catch (error) {
      // Update log with error
      log.status = 'failed';
      log.error = error instanceof Error ? error.message : 'Unknown error';

      logger.error(`Email sending failed: ${logId}`, {
        template: request.template,
        to: request.to,
        error: log.error,
      });

      throw error;
    } finally {
      this.emailLogs.push(log);
    }
  }

  /**
   * Send user registration email
   */
  async sendUserRegistration(data: {
    firstName: string;
    lastName: string;
    email: string;
    verificationUrl: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('user-registration');
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

  /**
   * Send email verification email
   */
  async sendEmailVerification(data: {
    firstName: string;
    email: string;
    verificationUrl: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('email-verification');
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

  /**
   * Send password reset email
   */
  async sendPasswordReset(data: {
    firstName: string;
    email: string;
    resetUrl: string;
    expiryHours: number;
  }): Promise<EmailResponse> {
    const template = getTemplate('password-reset');
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

  /**
   * Send user invitation email
   */
  async sendUserInvitation(data: {
    email: string;
    inviterName: string;
    roleName: string;
    acceptUrl: string;
    expiryHours: number;
  }): Promise<EmailResponse> {
    const template = getTemplate('user-invitation');
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

  /**
   * Send event invitation email
   */
  async sendEventInvitation(data: {
    email: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    inviterName: string;
    acceptUrl: string;
    declineUrl: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('event-invitation');
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

  /**
   * Send event reminder email
   */
  async sendEventReminder(data: {
    email: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    clientName: string;
    daysUntilEvent: number;
  }): Promise<EmailResponse> {
    const template = getTemplate('event-reminder');
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

  /**
   * Send invoice email
   */
  async sendInvoice(data: {
    email: string;
    invoiceNumber: string;
    clientName: string;
    total: number;
    currency: string;
    dueDate: string;
    downloadUrl: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('invoice-sent');
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

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(data: {
    email: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    currency: string;
    dueDate: string;
    overdueDays: number;
    paymentUrl: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('payment-reminder');
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

  /**
   * Send vendor assignment email
   */
  async sendVendorAssignment(data: {
    email: string;
    vendorName: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    services: string[];
    contactPerson: string;
  }): Promise<EmailResponse> {
    const template = getTemplate('vendor-assignment');
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

  /**
   * Send deliverable reminder email
   */
  async sendDeliverableReminder(data: {
    email: string;
    deliverableName: string;
    eventName: string;
    dueDate: string;
    vendorName: string;
    daysUntilDue: number;
  }): Promise<EmailResponse> {
    const template = getTemplate('deliverable-reminder');
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

  /**
   * Get email statistics
   */
  getStats(): EmailStats {
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

  /**
   * Get email logs
   */
  getLogs(limit: number = 100): EmailLog[] {
    return this.emailLogs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get email log by ID
   */
  getLogById(id: string): EmailLog | null {
    return this.emailLogs.find(log => log.id === id) || null;
  }

  /**
   * Clear email logs
   */
  clearLogs(): void {
    this.emailLogs = [];
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error('Email service connection test failed', { error });
      return false;
    }
  }

  /**
   * Get available templates
   */
  getAvailableTemplates(): string[] {
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

  /**
   * Check if using Ethereal
   */
  isUsingEthereal(): boolean {
    return this.isEthereal;
  }
}

export default EmailService; 