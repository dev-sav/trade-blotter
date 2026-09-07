import { db } from '../prisma/db.js';
import type {
  AmendTradeRequest,
  CreateTradeRequest,
} from '../validation/tradeValidation.js';

export async function getTrades() {
  return db.orm.public.Trade.all();
}

export async function createTrade(
  request: CreateTradeRequest,
) {
  return db.orm.public.Trade.create({
    ...request,
    status: 'ACTIVE',
  });
}

export async function amendTrade(
  id: number,
  request: AmendTradeRequest,
) {
  const existingTrade = await db.orm.public.Trade
    .where({ id })
    .first();

  if (!existingTrade) {
    throw new Error('TRADE_NOT_FOUND');
  }

  if (existingTrade.status === 'CANCELLED') {
    throw new Error('TRADE_ALREADY_CANCELLED');
  }

  return db.orm.public.Trade
    .where({ id })
    .update({
      ...request,
    });
}

export async function cancelTrade(id: number) {
  const existingTrade = await db.orm.public.Trade
    .where({ id })
    .first();

  if (!existingTrade) {
    throw new Error('TRADE_NOT_FOUND');
  }

  if (existingTrade.status === 'CANCELLED') {
    throw new Error('TRADE_ALREADY_CANCELLED');
  }

  return db.orm.public.Trade
    .where({ id })
    .update({
      status: 'CANCELLED',
    });
}