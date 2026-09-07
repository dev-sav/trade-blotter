import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TradeTable } from './TradeTable';
import type { Trade } from '../../types/trade';

const trades: Trade[] = [
    {
        id: 1,
        symbol: 'AAPL',
        quantity: 100,
        price: 182.43,
        side: 'BUY',
        trader: 'Alice',
        tradeTimestamp: '2026-09-07T10:00:00.000Z',
        status: 'ACTIVE',
        createdAt: '2026-09-07T10:00:00.000Z',
        updatedAt: '2026-09-07T10:00:00.000Z',
    },
    {
        id: 2,
        symbol: 'MSFT',
        quantity: 200,
        price: 410.25,
        side: 'SELL',
        trader: 'Bob',
        tradeTimestamp: '2026-09-07T11:00:00.000Z',
        status: 'CANCELLED',
        createdAt: '2026-09-07T11:00:00.000Z',
        updatedAt: '2026-09-07T11:00:00.000Z',
    },
];

describe('TradeTable', () => {
    it('renders the trades', () => {
        render(
            <TradeTable
                trades={trades}
                onAmend={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('MSFT')).toBeInTheDocument();

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('sorts trades by symbol', () => {
        render(
            <TradeTable
                trades={trades}
                onAmend={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        const symbolButton = screen.getByRole('button', {
            name: 'Symbol',
        });

        fireEvent.click(symbolButton);

        const rows = screen.getAllByRole('row');

        expect(rows[1]).toHaveTextContent('AAPL');
        expect(rows[2]).toHaveTextContent('MSFT');

        fireEvent.click(symbolButton);

        const descendingRows = screen.getAllByRole('row');

        expect(descendingRows[1]).toHaveTextContent('MSFT');
        expect(descendingRows[2]).toHaveTextContent('AAPL');
    });

    it('calls the correct action handler for an active trade', () => {
        const onAmend = vi.fn();
        const onCancel = vi.fn();

        render(
            <TradeTable
                trades={trades}
                onAmend={onAmend}
                onCancel={onCancel}
            />,
        );

        const amendButton = screen.getByRole('button', {
            name: 'Amend',
        });

        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });

        fireEvent.click(amendButton);
        fireEvent.click(cancelButton);

        expect(onAmend).toHaveBeenCalledWith(trades[0]);
        expect(onCancel).toHaveBeenCalledWith(trades[0]);
    });

    it('does not show actions for a cancelled trade', () => {
        render(
            <TradeTable
                trades={trades}
                onAmend={vi.fn()}
                onCancel={vi.fn()}
            />,
        );

        expect(
            screen.getAllByRole('button', { name: 'Amend' }),
        ).toHaveLength(1);

        expect(
            screen.getAllByRole('button', { name: 'Cancel' }),
        ).toHaveLength(1);

        expect(screen.getByText('—')).toBeInTheDocument();
    });
});