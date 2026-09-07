export type TradeSide = 'BUY' | 'SELL';

export type TradeStatus = 'ACTIVE' | 'CANCELLED';

export interface Trade {
  id: number;
  symbol: string;
  quantity: number;
  price: number;
  side: TradeSide;
  trader: string;
  tradeTimestamp: string;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
}