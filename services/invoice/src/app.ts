import express from 'express';
import { json, urlencoded } from 'express';
import invoiceRouter from './routes/invoice';
import { authenticateJwt } from './middleware/auth';

console.log('CONTAINER BUILD TEST - INVOICE SERVICE');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'invoice' });
});

app.use(authenticateJwt); // Require JWT for all routes

app.use('/invoices', invoiceRouter);

export default app; 