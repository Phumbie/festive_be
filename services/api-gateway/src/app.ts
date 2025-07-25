import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dashboardRouter from './routes/dashboard';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth:3001';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://event:3002';
const VENDOR_SERVICE_URL = process.env.VENDOR_SERVICE_URL || 'http://vendor:3003';
const INVOICE_SERVICE_URL = process.env.INVOICE_SERVICE_URL || 'http://invoice:3004';
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://email:3005';

const app = express();

// Request logging middleware (should be first)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// PROXY MIDDLEWARE FOR AUTH - MUST COME BEFORE BODY PARSERS!
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth/': '/auth/',
    '^/api/auth': '/auth',
  },
}));

// Body parsers for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy routes to microservices
app.use('/api/events', createProxyMiddleware({ target: EVENT_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/api/events': '' } }));
app.use('/api/vendors', createProxyMiddleware({ target: VENDOR_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/api/vendors': '' } }));
app.use('/api/invoices', createProxyMiddleware({ target: INVOICE_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/api/invoices': '' } }));
app.use('/api/email', createProxyMiddleware({ target: EMAIL_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/api/email': '' } }));

// Dashboard routes (aggregation functionality)
app.use('/api', dashboardRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Global error handler for proxy errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && err.code === 'ECONNREFUSED') {
    console.error('Proxy connection refused:', err);
    res.status(502).json({ error: 'Proxy connection refused', details: err.message });
  } else if (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Proxy error', details: err.message });
  } else {
    next();
  }
});

export default app; 