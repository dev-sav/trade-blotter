import type { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

let webSocketServer: WebSocketServer;

export function initializeWebSocketServer(server: Server) {
  webSocketServer = new WebSocketServer({
    server,
    path: '/ws',
  });

  webSocketServer.on('connection', (socket) => {
    console.log('WebSocket client connected');

    socket.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

export function broadcastTradeUpdate(
  event: unknown,
) {
  if (!webSocketServer) {
    return;
  }

  const message = JSON.stringify(event);

  webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}