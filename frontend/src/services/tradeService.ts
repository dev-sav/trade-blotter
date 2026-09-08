import type { Trade, TradeSide } from '../types/trade';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTrades(): Promise<Trade[]> {
    const response = await fetch(`${API_BASE_URL}/trades`);

    if (!response.ok) {
        throw new Error('Failed to fetch trades');
    }

    return response.json() as Promise<Trade[]>;
}

export interface CreateTradeRequest {
    userId: number,
    symbol: string;
    quantity: number;
    price: number;
    side: TradeSide;
    trader: string;
    tradeTimestamp: string;
}

export async function createTrade(
    trade: CreateTradeRequest,
): Promise<Trade> {
    const response = await fetch(`${API_BASE_URL}/trades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message ?? 'Failed to create trade',
        );
    }

    return response.json() as Promise<Trade>;
}

export async function amendTrade(
    id: number,
    trade: CreateTradeRequest,
): Promise<Trade> {
    const response = await fetch(
        `${API_BASE_URL}/trades/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trade),
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message ?? 'Failed to amend trade',
        );
    }

    return response.json() as Promise<Trade>;
}

export async function cancelTrade(
    id: number,
    userId: number,
): Promise<Trade> {
    const response = await fetch(
        `${API_BASE_URL}/trades/${id}/cancel`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
            }),
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message ?? 'Failed to cancel trade',
        );
    }

    return response.json() as Promise<Trade>;
}