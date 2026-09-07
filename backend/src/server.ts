import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';

import tradeRoutes from './routes/tradeRoutes.js';
import { initializeWebSocketServer } from './services/webSocketService.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/trades', tradeRoutes);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});