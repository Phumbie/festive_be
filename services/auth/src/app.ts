import express from 'express';
import { json, urlencoded } from 'express';
import authRouter from './routes/auth';
import roleRouter from './routes/role';
import userManagementRouter from './routes/userManagement';
import passport from 'passport';
import session from 'express-session';
import './passport/google';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session({ secret: process.env.JWT_SECRET || 'supersecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/auth', roleRouter);
app.use('/api/auth', userManagementRouter);

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    // On success, issue JWT and redirect or respond
    // @ts-ignore
    const user = req.user;
    // You may want to redirect to frontend with token as query param
    res.json({ message: 'Google SSO successful', user });
  }
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

export default app; 