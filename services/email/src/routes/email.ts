import { Router } from 'express';
import EmailController from '../controllers/emailController';
import EmailService from '../services/emailService';
import { EmailConfig } from '../types/email';

// Initialize email service with configuration
const createEmailConfig = (): EmailConfig => ({
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
  const router = Router();
  
  // Initialize email service
  const emailConfig = createEmailConfig();
  const emailService = new EmailService(emailConfig);
  const emailController = new EmailController(emailService);

  // Add a small delay to ensure transporter is initialized
  setTimeout(() => {
    console.log('Email service initialized and ready');
  }, 1000);

    // Generic email sending
  router.post('/send', emailController.sendEmail.bind(emailController));

  // User management emails
  router.post('/user-registration', emailController.sendUserRegistration.bind(emailController));
  router.post('/email-verification', emailController.sendEmailVerification.bind(emailController));
  router.post('/password-reset', emailController.sendPasswordReset.bind(emailController));
  router.post('/user-invitation', emailController.sendUserInvitation.bind(emailController));

  // Event management emails
  router.post('/event-invitation', emailController.sendEventInvitation.bind(emailController));
  router.post('/event-reminder', emailController.sendEventReminder.bind(emailController));

  // Invoice emails
  router.post('/invoice', emailController.sendInvoice.bind(emailController));
  router.post('/payment-reminder', emailController.sendPaymentReminder.bind(emailController));

  // Vendor emails
  router.post('/vendor-assignment', emailController.sendVendorAssignment.bind(emailController));
  router.post('/deliverable-reminder', emailController.sendDeliverableReminder.bind(emailController));

  // Email management
  router.get('/stats', emailController.getStats.bind(emailController));
  router.get('/logs', emailController.getLogs.bind(emailController));
  router.get('/logs/:id', emailController.getLogById.bind(emailController));
  router.get('/templates', emailController.getTemplates.bind(emailController));
  router.get('/test-connection', emailController.testConnection.bind(emailController));
  router.delete('/logs', emailController.clearLogs.bind(emailController));

  return router;
};

export default createEmailRouter(); 