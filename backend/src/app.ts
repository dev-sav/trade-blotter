import express from 'express';
import cors from 'cors';

import tradeRoutes from './routes/tradeRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/trades', tradeRoutes);
app.use('/api/users', userRoutes);

export default app;