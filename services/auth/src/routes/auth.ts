import { Router } from 'express';
import { register, login, verifyEmail, me } from '../controllers/authController';
import { authenticateJwt } from '../middleware/auth';
import { inviteUser, acceptInvite } from '../controllers/inviteController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.get('/me', authenticateJwt, me);
router.post('/invite', authenticateJwt, inviteUser);
router.post('/accept-invite', acceptInvite);

export default router; 