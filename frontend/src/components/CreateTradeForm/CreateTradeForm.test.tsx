import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CreateTradeForm from './CreateTradeForm';
import * as tradeService from '../../services/tradeService';
import type { Trade } from '../../types/trade';

const createdTrade: Trade = {
    id: 3,
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

describe('CreateTradeForm', () => {
    it('submits a new trade', async () => {
        vi.spyOn(tradeService, 'createTrade')
            .mockResolvedValue(createdTrade);

        const onCreated = vi.fn();
        const onCancel = vi.fn();

        render(
            <CreateTradeForm
                currentUserId={1}
                onCreated={onCreated}
                onCancel={onCancel}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText('AAPL'), {
            target: { value: 'aapl' },
        });

        fireEvent.change(screen.getByPlaceholderText('100'), {
            target: { value: '250' },
        });

        fireEvent.change(screen.getByPlaceholderText('182.43'), {
            target: { value: '190.50' },
        });

        fireEvent.change(screen.getByPlaceholderText('Trader name'), {
            target: { value: ' Alice ' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: 'Create Trade' }),
        );

        await waitFor(() => {
            expect(tradeService.createTrade).toHaveBeenCalledWith(
                expect.objectContaining({
                    symbol: 'AAPL',
                    quantity: 250,
                    price: 190.5,
                    side: 'BUY',
                    trader: 'Alice',
                }),
            );
        });

        expect(onCreated).toHaveBeenCalledWith(createdTrade);
    });
});