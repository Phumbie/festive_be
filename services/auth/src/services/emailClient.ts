import axios from 'axios';

interface EmailServiceConfig {
  baseURL: string;
  timeout: number;
}

interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  verificationUrl: string;
}

interface EmailVerificationData {
  firstName: string;
  email: string;
  verificationUrl: string;
}

interface PasswordResetData {
  firstName: string;
  email: string;
  resetUrl: string;
  expiryHours: number;
}

interface UserInvitationData {
  email: string;
  inviterName: string;
  roleName: string;
  acceptUrl: string;
  expiryHours: number;
}

class EmailClient {
  private config: EmailServiceConfig;

  constructor() {
    this.config = {
      baseURL: process.env.EMAIL_SERVICE_URL || 'http://localhost:3005',
      timeout: 10000, // 10 seconds
    };
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/api/email/${endpoint}`,
        data,
        {
          timeout: this.config.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Email service error (${endpoint}):`, error);
      throw new Error(`Failed to send email via email service: ${error}`);
    }
  }

  async sendUserRegistration(data: UserRegistrationData) {
    return this.makeRequest('user-registration', data);
  }

  async sendEmailVerification(data: EmailVerificationData) {
    return this.makeRequest('email-verification', data);
  }

  async sendPasswordReset(data: PasswordResetData) {
    return this.makeRequest('password-reset', data);
  }

  async sendUserInvitation(data: UserInvitationData) {
    return this.makeRequest('user-invitation', data);
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.baseURL}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Email service health check failed:', error);
      return false;
    }
  }
}

export default new EmailClient(); 