import { Request, Response } from 'express';
import EmailService from '../services/emailService';
export default class EmailController {
    private emailService;
    constructor(emailService: EmailService);
    sendEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendUserRegistration(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendEmailVerification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendPasswordReset(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendUserInvitation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendEventInvitation(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendEventReminder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendPaymentReminder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendVendorAssignment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    sendDeliverableReminder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStats(req: Request, res: Response): Promise<void>;
    getLogs(req: Request, res: Response): Promise<void>;
    getLogById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTemplates(req: Request, res: Response): Promise<void>;
    testConnection(req: Request, res: Response): Promise<void>;
    clearLogs(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=emailController.d.ts.map