import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  // Debug log
  if (process.env.NODE_ENV !== 'production') {
    console.log('Auth middleware path:', req.path, 'originalUrl:', req.originalUrl);
  }
  if (req.path.includes('/health') || req.originalUrl.includes('/health')) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
} 