import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CancelTradeDialog from './CancelTradeDialog';
import * as tradeService from '../../services/tradeService';
import type { Trade } from '../../types/trade';

const trade: Trade = {
    id: 10,
    symbol: 'AAPL',
    quantity: 100,
    price: 182.43,
    side: 'BUY',
    trader: 'Alice',
    tradeTimestamp: '2026-09-07T10:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2026-09-07T10:00:00.000Z',
    updatedAt: '2026-09-07T10:00:00.000Z',
};

const cancelledTrade: Trade = {
    ...trade,
    status: 'CANCELLED',
};

describe('CancelTradeDialog', () => {
    it('cancels the trade when confirmed', async () => {
        vi.spyOn(tradeService, 'cancelTrade')
            .mockResolvedValue(cancelledTrade);

        const onCancelled = vi.fn();
        const onCancel = vi.fn();

        render(
            <CancelTradeDialog
                trade={trade}
                onCancelled={onCancelled}
                onCancel={onCancel}
            />,
        );

        expect(
            screen.getByText(
                'Are you sure you want to cancel trade #10 (AAPL)?',
            ),
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Cancel Trade',
            }),
        );

        await waitFor(() => {
            expect(tradeService.cancelTrade).toHaveBeenCalledWith(10);
        });

        expect(onCancelled).toHaveBeenCalledWith(cancelledTrade);
    });
});