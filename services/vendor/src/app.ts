import express from 'express';
import { json, urlencoded } from 'express';
import vendorRouter from './routes/vendor';
import analyticsRouter from './routes/analytics';
import { authenticateJwt } from './middleware/auth';

console.log('CONTAINER BUILD TEST - VENDOR SERVICE');

const app = express();



app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vendor' });
});

app.use(authenticateJwt); // Require JWT for all routes

app.use('/vendors', vendorRouter);
app.use('/vendors', analyticsRouter);

export default app; 