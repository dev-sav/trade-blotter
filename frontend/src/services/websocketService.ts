import type { Trade } from '../types/trade';

export type TradeEvent =
  | {
      type: 'TRADE_CREATED';
      trade: Trade;
    }
  | {
      type: 'TRADE_UPDATED';
      trade: Trade;
    }
  | {
      type: 'TRADE_CANCELLED';
      trade: Trade;
    };

const WS_URL = 'ws://localhost:3000/ws';
const RECONNECT_DELAY = 2000;

export function connectToTradeUpdates(
  onMessage: (event: TradeEvent) => void,
): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let isClosing = false;

  function connect() {
    if (isClosing) {
      return;
    }

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('Connected to trade updates');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as TradeEvent;

        console.log('Trade update received:', message);

        onMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Disconnected from trade updates');

      if (isClosing) {
        return;
      }

      reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, RECONNECT_DELAY);
    };
  }

  connect();

  return () => {
    isClosing = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (socket) {
      socket.close();
      socket = null;
    }
  };
}