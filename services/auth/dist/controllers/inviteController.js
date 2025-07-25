"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteUser = inviteUser;
exports.acceptInvite = acceptInvite;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const emailClient_1 = __importDefault(require("../services/emailClient"));
const prisma = new client_1.PrismaClient();
async function inviteUser(req, res) {
    const { email, roleId } = req.body;
    if (!email || !roleId)
        return res.status(400).json({ error: 'Missing email or roleId' });
    try {
        const token = (0, uuid_1.v4)();
        await prisma.verificationToken.create({
            data: {
                token,
                userId: '', // Will be set on accept
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        });
        const acceptUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/auth/accept-invite?token=${token}&roleId=${roleId}&email=${email}`;
        try {
            await emailClient_1.default.sendUserInvitation({
                email,
                inviterName: 'System', // TODO: Get actual inviter name
                roleName: 'User', // TODO: Get actual role name
                acceptUrl,
                expiryHours: 24,
            });
            console.log(`✅ Invitation email sent to ${email}`);
        }
        catch (emailError) {
            console.error('⚠️ Failed to send invitation email:', emailError);
            // Continue with invite even if email fails
        }
        res.json({ message: 'Invite sent' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send invite', details: err });
    }
}
async function acceptInvite(req, res) {
    const { token, email, firstName, lastName, password, roleId } = req.body;
    if (!token || !email || !firstName || !lastName || !password || !roleId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const invite = await prisma.verificationToken.findUnique({ where: { token } });
        if (!invite || invite.expiresAt < new Date())
            return res.status(400).json({ error: 'Invalid or expired token' });
        const hashed = await require('bcryptjs').hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                firstName,
                lastName,
                emailVerified: true,
            },
        });
        await prisma.userRole.create({ data: { userId: user.id, roleId } });
        await prisma.verificationToken.delete({ where: { token } });
        res.json({ message: 'Invite accepted', user: { id: user.id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to accept invite', details: err });
    }
}
