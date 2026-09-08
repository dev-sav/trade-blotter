import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AmendTradeForm from './AmendTradeForm';
import * as tradeService from '../../services/tradeService';
import type { Trade } from '../../types/trade';

const trade: Trade = {
    id: 10,
    symbol: 'MSFT',
    quantity: 100,
    price: 400,
    side: 'BUY',
    trader: 'Alice',
    tradeTimestamp: '2026-09-07T10:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2026-09-07T10:00:00.000Z',
    updatedAt: '2026-09-07T10:00:00.000Z',
};

const updatedTrade: Trade = {
    ...trade,
    symbol: 'AAPL',
    quantity: 200,
    price: 190,
};

describe('AmendTradeForm', () => {
    it('submits the amended trade', async () => {
        vi.spyOn(tradeService, 'amendTrade')
            .mockResolvedValue(updatedTrade);

        const onUpdated = vi.fn();
        const onCancel = vi.fn();

        render(
            <AmendTradeForm
                trade={trade}
                currentUserId={1}
                onUpdated={onUpdated}
                onCancel={onCancel}
            />,
        );

        const symbolInput = screen.getByDisplayValue('MSFT');
        const quantityInput = screen.getByDisplayValue('100');
        const priceInput = screen.getByDisplayValue('400');

        fireEvent.change(symbolInput, {
            target: { value: 'aapl' },
        });

        fireEvent.change(quantityInput, {
            target: { value: '200' },
        });

        fireEvent.change(priceInput, {
            target: { value: '190' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Save Changes' }),
        );

        await waitFor(() => {
            expect(tradeService.amendTrade).toHaveBeenCalledWith(
                10,
                expect.objectContaining({
                    symbol: 'AAPL',
                    quantity: 200,
                    price: 190,
                    side: 'BUY',
                    trader: 'Alice',
                }),
            );
        });

        expect(onUpdated).toHaveBeenCalledWith(updatedTrade);
    });
});