export interface EmailRequest {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  attachments?: EmailAttachment[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  path?: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
  success: boolean;
  previewUrl?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  replyTo?: string;
}

export interface EmailStats {
  sent: number;
  failed: number;
  pending: number;
  total: number;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
}

// Email template data interfaces
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  verificationUrl: string;
}

export interface EmailVerificationData {
  firstName: string;
  email: string;
  verificationUrl: string;
}

export interface PasswordResetData {
  firstName: string;
  email: string;
  resetUrl: string;
  expiryHours: number;
}

export interface UserInvitationData {
  email: string;
  inviterName: string;
  roleName: string;
  acceptUrl: string;
  expiryHours: number;
}

export interface EventInvitationData {
  email: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  inviterName: string;
  acceptUrl: string;
  declineUrl: string;
}

export interface InvoiceData {
  email: string;
  invoiceNumber: string;
  clientName: string;
  total: number;
  currency: string;
  dueDate: string;
  downloadUrl: string;
}

export interface PaymentReminderData {
  email: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  dueDate: string;
  overdueDays: number;
  paymentUrl: string;
}

export interface EventReminderData {
  email: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  clientName: string;
  daysUntilEvent: number;
}

export interface VendorAssignmentData {
  email: string;
  vendorName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  services: string[];
  contactPerson: string;
}

export interface DeliverableReminderData {
  email: string;
  deliverableName: string;
  eventName: string;
  dueDate: string;
  vendorName: string;
  daysUntilDue: number;
} 