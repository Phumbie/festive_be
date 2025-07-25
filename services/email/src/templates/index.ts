import { EmailTemplate } from '../types/email';

// Email template registry
export const emailTemplates: Record<string, EmailTemplate> = {
  // User Management Templates
  'user-registration': {
    name: 'user-registration',
    subject: 'Welcome to Festive - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Festive</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Festive!</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}} {{lastName}},</h2>
            <p>Thank you for registering with Festive Event Management Platform!</p>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{verificationUrl}}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Festive!
      
      Hi {{firstName}} {{lastName}},
      
      Thank you for registering with Festive Event Management Platform!
      
      To complete your registration, please verify your email address by visiting:
      {{verificationUrl}}
      
      This link will expire in 24 hours.
      
      Best regards,
      The Festive Team
    `
  },

  'email-verification': {
    name: 'email-verification',
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="{{verificationUrl}}" class="button">Verify Email</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{verificationUrl}}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Verify Your Email
      
      Hi {{firstName}},
      
      Please verify your email address by visiting:
      {{verificationUrl}}
      
      This link will expire in 24 hours.
      
      Best regards,
      The Festive Team
    `
  },

  'password-reset': {
    name: 'password-reset',
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="{{resetUrl}}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{resetUrl}}</p>
            <p>This link will expire in {{expiryHours}} hours.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Reset Your Password
      
      Hi {{firstName}},
      
      You requested to reset your password. Please visit:
      {{resetUrl}}
      
      This link will expire in {{expiryHours}} hours.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The Festive Team
    `
  },

  'user-invitation': {
    name: 'user-invitation',
    subject: 'You\'re Invited to Join Festive',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Invited!</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>{{inviterName}} has invited you to join Festive Event Management Platform.</p>
            <p>You'll be joining as a <strong>{{roleName}}</strong>.</p>
            <p>Click the button below to accept the invitation and create your account:</p>
            <p style="text-align: center;">
              <a href="{{acceptUrl}}" class="button">Accept Invitation</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{acceptUrl}}</p>
            <p>This invitation will expire in {{expiryHours}} hours.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      You're Invited!
      
      Hello!
      
      {{inviterName}} has invited you to join Festive Event Management Platform.
      You'll be joining as a {{roleName}}.
      
      To accept the invitation, please visit:
      {{acceptUrl}}
      
      This invitation will expire in {{expiryHours}} hours.
      
      Best regards,
      The Festive Team
    `
  },

  // Event Management Templates
  'event-invitation': {
    name: 'event-invitation',
    subject: 'Event Invitation: {{eventName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7C3AED; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 5px; }
          .accept { background: #059669; color: white; }
          .decline { background: #DC2626; color: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Invitation</h1>
          </div>
          <div class="content">
            <h2>You're Invited!</h2>
            <p>{{inviterName}} has invited you to attend:</p>
            <h3>{{eventName}}</h3>
            <p><strong>Date:</strong> {{eventDate}}</p>
            <p><strong>Location:</strong> {{eventLocation}}</p>
            <p style="text-align: center;">
              <a href="{{acceptUrl}}" class="button accept">Accept Invitation</a>
              <a href="{{declineUrl}}" class="button decline">Decline</a>
            </p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Event Invitation
      
      You're Invited!
      
      {{inviterName}} has invited you to attend:
      {{eventName}}
      
      Date: {{eventDate}}
      Location: {{eventLocation}}
      
      Accept: {{acceptUrl}}
      Decline: {{declineUrl}}
      
      Best regards,
      The Festive Team
    `
  },

  'event-reminder': {
    name: 'event-reminder',
    subject: 'Event Reminder: {{eventName}} in {{daysUntilEvent}} days',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi {{clientName}},</h2>
            <p>This is a friendly reminder about your upcoming event:</p>
            <h3>{{eventName}}</h3>
            <p><strong>Date:</strong> {{eventDate}}</p>
            <p><strong>Location:</strong> {{eventLocation}}</p>
            <p>Your event is in <strong>{{daysUntilEvent}} days</strong>!</p>
            <p>Please make sure all preparations are in place.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Event Reminder
      
      Hi {{clientName}},
      
      This is a friendly reminder about your upcoming event:
      {{eventName}}
      
      Date: {{eventDate}}
      Location: {{eventLocation}}
      
      Your event is in {{daysUntilEvent}} days!
      
      Please make sure all preparations are in place.
      
      Best regards,
      The Festive Team
    `
  },

  // Invoice Templates
  'invoice-sent': {
    name: 'invoice-sent',
    subject: 'Invoice {{invoiceNumber}} - {{clientName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice</h1>
          </div>
          <div class="content">
            <h2>Hi {{clientName}},</h2>
            <p>Your invoice <strong>{{invoiceNumber}}</strong> is ready.</p>
            <p><strong>Total Amount:</strong> {{currency}} {{total}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            <p style="text-align: center;">
              <a href="{{downloadUrl}}" class="button">Download Invoice</a>
            </p>
            <p>Thank you for your business!</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Invoice
      
      Hi {{clientName}},
      
      Your invoice {{invoiceNumber}} is ready.
      
      Total Amount: {{currency}} {{total}}
      Due Date: {{dueDate}}
      
      Download: {{downloadUrl}}
      
      Thank you for your business!
      
      Best regards,
      The Festive Team
    `
  },

  'payment-reminder': {
    name: 'payment-reminder',
    subject: 'Payment Reminder: Invoice {{invoiceNumber}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi {{clientName}},</h2>
            <p>This is a friendly reminder about your outstanding payment:</p>
            <p><strong>Invoice:</strong> {{invoiceNumber}}</p>
            <p><strong>Amount:</strong> {{currency}} {{amount}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            {{#if overdueDays}}
            <p><strong>Days Overdue:</strong> {{overdueDays}}</p>
            {{/if}}
            <p style="text-align: center;">
              <a href="{{paymentUrl}}" class="button">Make Payment</a>
            </p>
            <p>Thank you for your prompt attention to this matter.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Payment Reminder
      
      Hi {{clientName}},
      
      This is a friendly reminder about your outstanding payment:
      
      Invoice: {{invoiceNumber}}
      Amount: {{currency}} {{amount}}
      Due Date: {{dueDate}}
      {{#if overdueDays}}Days Overdue: {{overdueDays}}{{/if}}
      
      Make Payment: {{paymentUrl}}
      
      Thank you for your prompt attention to this matter.
      
      Best regards,
      The Festive Team
    `
  },

  // Vendor Templates
  'vendor-assignment': {
    name: 'vendor-assignment',
    subject: 'Vendor Assignment: {{eventName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vendor Assignment</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7C3AED; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Vendor Assignment</h1>
          </div>
          <div class="content">
            <h2>Hi {{vendorName}},</h2>
            <p>You have been assigned to provide services for:</p>
            <h3>{{eventName}}</h3>
            <p><strong>Date:</strong> {{eventDate}}</p>
            <p><strong>Location:</strong> {{eventLocation}}</p>
            <p><strong>Contact Person:</strong> {{contactPerson}}</p>
            <p><strong>Services:</strong></p>
            <ul>
              {{#each services}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
            <p>Please review the event details and confirm your availability.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Vendor Assignment
      
      Hi {{vendorName}},
      
      You have been assigned to provide services for:
      {{eventName}}
      
      Date: {{eventDate}}
      Location: {{eventLocation}}
      Contact Person: {{contactPerson}}
      
      Services:
      {{#each services}}
      - {{this}}
      {{/each}}
      
      Please review the event details and confirm your availability.
      
      Best regards,
      The Festive Team
    `
  },

  'deliverable-reminder': {
    name: 'deliverable-reminder',
    subject: 'Deliverable Reminder: {{deliverableName}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deliverable Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Deliverable Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi {{vendorName}},</h2>
            <p>This is a reminder about your upcoming deliverable:</p>
            <h3>{{deliverableName}}</h3>
            <p><strong>Event:</strong> {{eventName}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            <p>Your deliverable is due in <strong>{{daysUntilDue}} days</strong>!</p>
            <p>Please ensure timely completion and delivery.</p>
            <p>Best regards,<br>The Festive Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Festive Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Deliverable Reminder
      
      Hi {{vendorName}},
      
      This is a reminder about your upcoming deliverable:
      {{deliverableName}}
      
      Event: {{eventName}}
      Due Date: {{dueDate}}
      
      Your deliverable is due in {{daysUntilDue}} days!
      
      Please ensure timely completion and delivery.
      
      Best regards,
      The Festive Team
    `
  }
};

export function getTemplate(name: string): EmailTemplate | null {
  return emailTemplates[name] || null;
}

export function listTemplates(): string[] {
  return Object.keys(emailTemplates);
}

export function templateExists(name: string): boolean {
  return name in emailTemplates;
} 