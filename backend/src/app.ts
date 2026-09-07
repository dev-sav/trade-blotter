import express from 'express';
import cors from 'cors';

import tradeRoutes from './routes/tradeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/trades', tradeRoutes);

export default app;