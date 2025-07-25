import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
  (req as any).user = payload;
  next();
} 