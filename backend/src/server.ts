import http from 'http';
import 'dotenv/config';

import app from './app.js';
import { initializeWebSocketServer } from './services/websocketService.js';


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});