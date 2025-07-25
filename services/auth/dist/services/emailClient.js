"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class EmailClient {
    constructor() {
        this.config = {
            baseURL: process.env.EMAIL_SERVICE_URL || 'http://localhost:3005',
            timeout: 10000, // 10 seconds
        };
    }
    async makeRequest(endpoint, data) {
        try {
            const response = await axios_1.default.post(`${this.config.baseURL}/api/email/${endpoint}`, data, {
                timeout: this.config.timeout,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Email service error (${endpoint}):`, error);
            throw new Error(`Failed to send email via email service: ${error}`);
        }
    }
    async sendUserRegistration(data) {
        return this.makeRequest('user-registration', data);
    }
    async sendEmailVerification(data) {
        return this.makeRequest('email-verification', data);
    }
    async sendPasswordReset(data) {
        return this.makeRequest('password-reset', data);
    }
    async sendUserInvitation(data) {
        return this.makeRequest('user-invitation', data);
    }
    async testConnection() {
        try {
            const response = await axios_1.default.get(`${this.config.baseURL}/health`, {
                timeout: 5000,
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Email service health check failed:', error);
            return false;
        }
    }
}
exports.default = new EmailClient();
