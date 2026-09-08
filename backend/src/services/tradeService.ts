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
    const { userId, ...tradeData } = request;

    console.log('Creating trade for user:', userId);

    const trade = await db.orm.public.Trade.create({
        ...tradeData,
        status: 'ACTIVE',
    });

    console.log('Trade created:', trade.id);

    const auditLog = await db.orm.public.AuditLog.create({
        tradeId: trade.id,
        userId,
        action: 'CREATED',
        details: 'Trade created',
    });

    console.log('Audit log created:', auditLog);

    return trade;
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

    const { userId, ...tradeData } = request;

    const trade = await db.orm.public.Trade
        .where({ id })
        .update(tradeData);

    await db.orm.public.AuditLog.create({
        tradeId: id,
        userId,
        action: 'AMENDED',
        details: 'Trade amended',
    });

    return trade;
}

export async function cancelTrade(
    id: number,
    userId: number,
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

    const trade = await db.orm.public.Trade
        .where({ id })
        .update({
            status: 'CANCELLED',
        });

    await db.orm.public.AuditLog.create({
        tradeId: id,
        userId,
        action: 'CANCELLED',
        details: 'Trade cancelled',
    });

    return trade;
}