import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import emailClient from '../services/emailClient';

const prisma = new PrismaClient();

export async function inviteUser(req: Request, res: Response) {
  const { email, roleId } = req.body;
  if (!email || !roleId) return res.status(400).json({ error: 'Missing email or roleId' });
  try {
    const token = uuidv4();
    await prisma.verificationToken.create({
      data: {
        token,
        userId: '', // Will be set on accept
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const acceptUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/accept-invite?token=${token}&roleId=${roleId}&email=${email}`;
    
    try {
      await emailClient.sendUserInvitation({
        email,
        inviterName: 'System', // TODO: Get actual inviter name
        roleName: 'User', // TODO: Get actual role name
        acceptUrl,
        expiryHours: 24,
    });
      console.log(`✅ Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send invitation email:', emailError);
      // Continue with invite even if email fails
    }
    res.json({ message: 'Invite sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send invite', details: err });
  }
}

export async function acceptInvite(req: Request, res: Response) {
  const { token, email, firstName, lastName, password, roleId } = req.body;
  if (!token || !email || !firstName || !lastName || !password || !roleId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const invite = await prisma.verificationToken.findUnique({ where: { token } });
    if (!invite || invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept invite', details: err });
  }
} 