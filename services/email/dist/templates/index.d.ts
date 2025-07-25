import { EmailTemplate } from '../types/email';
export declare const emailTemplates: Record<string, EmailTemplate>;
export declare function getTemplate(name: string): EmailTemplate | null;
export declare function listTemplates(): string[];
export declare function templateExists(name: string): boolean;
//# sourceMappingURL=index.d.ts.map