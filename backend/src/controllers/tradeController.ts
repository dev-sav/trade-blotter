import type { Request, Response } from 'express';

import {
    validateAmendTradeRequest,
    validateCreateTradeRequest,
} from '../validation/tradeValidation.js';

import { broadcastTradeUpdate } from '../services/websocketService.js';

import {
    amendTrade,
    cancelTrade,
    createTrade,
    getTrades,
} from '../services/tradeService.js';

export async function getTradesController(
    _req: Request,
    res: Response,
) {
    try {
        const trades = await getTrades();

        return res.status(200).json(trades);
    } catch (error) {
        console.error('Failed to retrieve trades:', error);

        return res.status(500).json({
    message: 'Failed to retrieve trades',
    error: error instanceof Error ? error.message : String(error),
});
    }
}

export async function createTradeController(
    req: Request,
    res: Response,
) {
    const validation = validateCreateTradeRequest(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message,
        });
    }

    try {
        const trade = await createTrade(validation.data);

        broadcastTradeUpdate({
            type: 'TRADE_CREATED',
            trade,
        });

        return res.status(201).json(trade);
    } catch (error) {
        console.error('Failed to create trade:', error);

        return res.status(500).json({
            message: 'Failed to create trade',
        });
    }
}

export async function amendTradeController(
    req: Request,
    res: Response,
) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid trade ID',
        });
    }

    const validation = validateAmendTradeRequest(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message,
        });
    }

    try {
        const trade = await amendTrade(
            id,
            validation.data,
        );

        broadcastTradeUpdate({
            type: 'TRADE_UPDATED',
            trade,
        });

        return res.status(200).json(trade);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'TRADE_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Trade not found',
                });
            }

            if (
                error.message === 'TRADE_ALREADY_CANCELLED'
            ) {
                return res.status(409).json({
                    message:
                        'Cancelled trades cannot be amended',
                });
            }
        }

        console.error('Failed to amend trade:', error);

        return res.status(500).json({
            message: 'Failed to amend trade',
        });
    }
}

export async function cancelTradeController(
    req: Request,
    res: Response,
) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid trade ID',
        });
    }

    try {
        const trade = await cancelTrade(id);

        broadcastTradeUpdate({
            type: 'TRADE_CANCELLED',
            trade,
        });

        return res.status(200).json(trade);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'TRADE_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Trade not found',
                });
            }

            if (
                error.message === 'TRADE_ALREADY_CANCELLED'
            ) {
                return res.status(409).json({
                    message: 'Trade is already cancelled',
                });
            }
        }

        console.error('Failed to cancel trade:', error);

        return res.status(500).json({
            message: 'Failed to cancel trade',
        });
    }
}