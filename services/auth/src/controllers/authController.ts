import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { createDefaultRoles, assignAdminRoleToUser } from './roleController';
import emailClient from '../services/emailClient';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName, phoneNumber, businessName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return res.status(409).json({ error: 'Email already registered' });

    const existingNumber = await prisma.user.findFirst({ where: { phoneNumber } });
    if (existingNumber) return res.status(409).json({ error: 'Phone number already registered' });
    
    const hashed = await bcrypt.hash(password, 10);
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

    // Check if default roles exist, create them only once
    const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
    if (!adminRole) {
      // Only create roles if they don't exist yet
      await createDefaultRoles();
    }

    // Assign Admin role to every new user
    await assignAdminRoleToUser(user.id);
    console.log(`🎉 User registered and assigned Admin role: ${email}`);

    // Generate verification token
    const token = uuidv4();
    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    // Send verification email via email service
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/verify-email?token=${token}`;
    
    try {
      await emailClient.sendUserRegistration({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        verificationUrl,
      });
      console.log(`✅ Verification email sent to ${user.email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    const responseMessage = 'Account created successfully! You have been assigned the Admin role. Please verify your email.';
    
    res.status(201).json({ 
      message: responseMessage,
      isFirstUser: true,
      roleAssigned: 'Admin'
    });
  } catch (err) {
    console.error('❌ Registration failed:', err);
    res.status(500).json({ error: 'Registration failed', details: err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.emailVerified) return res.status(403).json({ error: 'Email not verified' });
    
    const token = signJwt({ id: user.id, email: user.email });
    
    // Extract role names
    const userRoles = user.roles.map((userRole: any) => userRole.role.name);

    // Extract and merge all permissions from all roles
    const allPermissions = user.roles
      .flatMap((userRole: any) => userRole.role.permissions.map((perm: any) => perm.name));

    // Optionally deduplicate permissions
    const uniquePermissions = Array.from(new Set(allPermissions));

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        roles: userRoles,
        permissions: uniquePermissions
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.query;
  if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Missing token' });
  try {
    const found = await prisma.verificationToken.findUnique({ where: { token } });
    if (!found || found.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });
    await prisma.user.update({ where: { id: found.userId }, data: { emailVerified: true } });
    await prisma.verificationToken.delete({ where: { token } });
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed', details: err });
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const dbUser = await prisma.user.findUnique({ 
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    // Extract role names
    const userRoles = dbUser.roles.map((userRole: any) => userRole.role.name);

    // Extract and merge all permissions from all roles
    const allPermissions = dbUser.roles
      .flatMap((userRole: any) => userRole.role.permissions.map((perm: any) => perm.name));

    // Optionally deduplicate permissions
    const uniquePermissions = Array.from(new Set(allPermissions));

    res.json({ 
      user: { 
        id: dbUser.id, 
        email: dbUser.email, 
        firstName: dbUser.firstName, 
        lastName: dbUser.lastName,
        roles: userRoles,
        permissions: uniquePermissions
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err });
  }
}