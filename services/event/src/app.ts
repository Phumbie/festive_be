import express from 'express';
import { json, urlencoded } from 'express';
import eventRouter from './routes/event';
import vendorRouter from './routes/vendor';
import scheduleRouter from './routes/schedule';
import attachmentRouter from './routes/attachment';
import paymentRouter from './routes/payment';
import deliverableRouter from './routes/deliverable';
import activityLogRouter from './routes/activityLog';
import analyticsRouter from './routes/analytics';
import { authenticateJwt } from './middleware/auth';

console.log('CONTAINER BUILD TEST - EVENT SERVICE');

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'event' });
});

app.use(authenticateJwt); // Require JWT for all routes

app.use('/events', eventRouter);
app.use('/events', vendorRouter);
app.use('/events', scheduleRouter);
app.use('/events', attachmentRouter);
app.use('/events', paymentRouter);
app.use('/events', deliverableRouter);
app.use('/events', activityLogRouter);
app.use('/events', analyticsRouter);

export default app; 