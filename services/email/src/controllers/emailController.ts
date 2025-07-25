import { Request, Response } from 'express';
import Joi from 'joi';
import EmailService from '../services/emailService';
import logger from '../utils/logger';

// Validation schemas
const sendEmailSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email().required(),
    Joi.array().items(Joi.string().email()).min(1).required()
  ),
  subject: Joi.string().required(),
  template: Joi.string().required(),
  data: Joi.object().required(),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    content: Joi.alternatives().try(Joi.string(), Joi.binary()),
    contentType: Joi.string(),
    path: Joi.string(),
  })),
  cc: Joi.array().items(Joi.string().email()),
  bcc: Joi.array().items(Joi.string().email()),
  replyTo: Joi.string().email(),
});

const userRegistrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  verificationUrl: Joi.string().uri().required(),
});

const emailVerificationSchema = Joi.object({
  firstName: Joi.string().required(),
  email: Joi.string().email().required(),
  verificationUrl: Joi.string().uri().required(),
});

const passwordResetSchema = Joi.object({
  firstName: Joi.string().required(),
  email: Joi.string().email().required(),
  resetUrl: Joi.string().uri().required(),
  expiryHours: Joi.number().integer().min(1).max(72).default(24),
});

const userInvitationSchema = Joi.object({
  email: Joi.string().email().required(),
  inviterName: Joi.string().required(),
  roleName: Joi.string().required(),
  acceptUrl: Joi.string().uri().required(),
  expiryHours: Joi.number().integer().min(1).max(168).default(72),
});

const eventInvitationSchema = Joi.object({
  email: Joi.string().email().required(),
  eventName: Joi.string().required(),
  eventDate: Joi.string().required(),
  eventLocation: Joi.string().required(),
  inviterName: Joi.string().required(),
  acceptUrl: Joi.string().uri().required(),
  declineUrl: Joi.string().uri().required(),
});

const eventReminderSchema = Joi.object({
  email: Joi.string().email().required(),
  eventName: Joi.string().required(),
  eventDate: Joi.string().required(),
  eventLocation: Joi.string().required(),
  clientName: Joi.string().required(),
  daysUntilEvent: Joi.number().integer().min(0).required(),
});

const invoiceSchema = Joi.object({
  email: Joi.string().email().required(),
  invoiceNumber: Joi.string().required(),
  clientName: Joi.string().required(),
  total: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  dueDate: Joi.string().required(),
  downloadUrl: Joi.string().uri().required(),
});

const paymentReminderSchema = Joi.object({
  email: Joi.string().email().required(),
  invoiceNumber: Joi.string().required(),
  clientName: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  dueDate: Joi.string().required(),
  overdueDays: Joi.number().integer().min(0).default(0),
  paymentUrl: Joi.string().uri().required(),
});

const vendorAssignmentSchema = Joi.object({
  email: Joi.string().email().required(),
  vendorName: Joi.string().required(),
  eventName: Joi.string().required(),
  eventDate: Joi.string().required(),
  eventLocation: Joi.string().required(),
  services: Joi.array().items(Joi.string()).min(1).required(),
  contactPerson: Joi.string().required(),
});

const deliverableReminderSchema = Joi.object({
  email: Joi.string().email().required(),
  deliverableName: Joi.string().required(),
  eventName: Joi.string().required(),
  dueDate: Joi.string().required(),
  vendorName: Joi.string().required(),
  daysUntilDue: Joi.number().integer().min(0).required(),
});

export default class EmailController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  /**
   * Send a generic email using a template
   */
  async sendEmail(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send user registration email
   */
  async sendUserRegistration(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send user registration email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send user registration email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send email verification email
   */
  async sendEmailVerification(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send email verification', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send email verification',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send password reset email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send user invitation email
   */
  async sendUserInvitation(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send user invitation email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send user invitation email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send event invitation email
   */
  async sendEventInvitation(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send event invitation email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send event invitation email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send event reminder email
   */
  async sendEventReminder(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send event reminder email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send event reminder email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send invoice email
   */
  async sendInvoice(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send invoice email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send invoice email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send payment reminder email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send payment reminder email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send vendor assignment email
   */
  async sendVendorAssignment(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send vendor assignment email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send vendor assignment email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Send deliverable reminder email
   */
  async sendDeliverableReminder(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to send deliverable reminder email', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to send deliverable reminder email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get email statistics
   */
  async getStats(req: Request, res: Response) {
    try {
      const stats = this.emailService.getStats();
      
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Failed to get email stats', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get email statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get email logs
   */
  async getLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = this.emailService.getLogs(limit);
      
      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      logger.error('Failed to get email logs', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get email logs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get email log by ID
   */
  async getLogById(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Failed to get email log by ID', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get email log',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get available templates
   */
  async getTemplates(req: Request, res: Response) {
    try {
      const templates = this.emailService.getAvailableTemplates();
      
      res.status(200).json({
        success: true,
        data: templates,
      });
    } catch (error) {
      logger.error('Failed to get templates', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get templates',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Test email connection
   */
  async testConnection(req: Request, res: Response) {
    try {
      const isConnected = await this.emailService.testConnection();
      
      res.status(200).json({
        success: true,
        data: {
          connected: isConnected,
        },
      });
    } catch (error) {
      logger.error('Failed to test email connection', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to test email connection',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Clear email logs
   */
  async clearLogs(req: Request, res: Response) {
    try {
      this.emailService.clearLogs();
      
      res.status(200).json({
        success: true,
        message: 'Email logs cleared successfully',
      });
    } catch (error) {
      logger.error('Failed to clear email logs', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to clear email logs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
} 