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

app.use('/', authRouter);
app.use('/', roleRouter);
app.use('/', userManagementRouter);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/login', (_req, res) => {
  res.json({ status: 'ok', service: 'login' });
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // On success, issue JWT and redirect or respond
    // @ts-ignore
    const user = req.user;
    // You may want to redirect to frontend with token as query param
    res.json({ message: 'Google SSO successful', user });
  }
);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${req.url} ${req.path}`);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

export default app; 