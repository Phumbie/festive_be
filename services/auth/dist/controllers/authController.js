"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verifyEmail = verifyEmail;
exports.me = me;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const uuid_1 = require("uuid");
const roleController_1 = require("./roleController");
const emailClient_1 = __importDefault(require("../services/emailClient"));
const prisma = new client_1.PrismaClient();
async function register(req, res) {
    const { email, password, firstName, lastName, phoneNumber, businessName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({ error: 'Email already registered' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                firstName,
                lastName,
                phoneNumber,
                businessName,
                emailVerified: false,
            },
        });
        // Check if this is the first user (account creator)
        const totalUsers = await prisma.user.count();
        const isFirstUser = totalUsers === 1;
        if (isFirstUser) {
            // Create default roles and assign admin role to the first user
            try {
                await (0, roleController_1.createDefaultRoles)();
                await (0, roleController_1.assignAdminRoleToUser)(user.id);
                console.log(`🎉 First user registered and assigned Admin role: ${email}`);
            }
            catch (roleError) {
                console.error('⚠️ Failed to create default roles or assign admin role:', roleError);
                // Continue with registration even if role assignment fails
            }
        }
        // Generate verification token
        const token = (0, uuid_1.v4)();
        await prisma.verificationToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
            },
        });
        // Send verification email via email service
        const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/auth/verify?token=${token}`;
        try {
            await emailClient_1.default.sendUserRegistration({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                verificationUrl,
            });
            console.log(`✅ Verification email sent to ${user.email}`);
        }
        catch (emailError) {
            console.error('⚠️ Failed to send verification email:', emailError);
            // Continue with registration even if email fails
        }
        const responseMessage = isFirstUser
            ? 'Account created successfully! You have been assigned the Admin role as the first user. Please verify your email.'
            : 'User registered. Please verify your email.';
        res.status(201).json({
            message: responseMessage,
            isFirstUser,
            roleAssigned: isFirstUser ? 'Admin' : null
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing credentials' });
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password)
            return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: 'Invalid credentials' });
        if (!user.emailVerified)
            return res.status(403).json({ error: 'Email not verified' });
        const token = (0, jwt_1.signJwt)({ id: user.id, email: user.email });
        res.json({ message: 'Login successful', token });
    }
    catch (err) {
        res.status(500).json({ error: 'Login failed', details: err });
    }
}
async function verifyEmail(req, res) {
    const { token } = req.query;
    if (!token || typeof token !== 'string')
        return res.status(400).json({ error: 'Missing token' });
    try {
        const found = await prisma.verificationToken.findUnique({ where: { token } });
        if (!found || found.expiresAt < new Date())
            return res.status(400).json({ error: 'Invalid or expired token' });
        await prisma.user.update({ where: { id: found.userId }, data: { emailVerified: true } });
        await prisma.verificationToken.delete({ where: { token } });
        res.json({ message: 'Email verified' });
    }
    catch (err) {
        res.status(500).json({ error: 'Verification failed', details: err });
    }
}
async function me(req, res) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser)
            return res.status(404).json({ error: 'User not found' });
        res.json({ user: { id: dbUser.id, email: dbUser.email, firstName: dbUser.firstName, lastName: dbUser.lastName } });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch user', details: err });
    }
}
