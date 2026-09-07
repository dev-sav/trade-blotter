import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TradeFilters } from './TradeFilters';

describe('TradeFilters', () => {
    it('calls the correct callbacks when filters change', () => {
        const onSearchChange = vi.fn();
        const onSideChange = vi.fn();
        const onStatusChange = vi.fn();
        const onRefresh = vi.fn();

        render(
            <TradeFilters
                search=""
                side="ALL"
                status="ALL"
                onSearchChange={onSearchChange}
                onSideChange={onSideChange}
                onStatusChange={onStatusChange}
                onRefresh={onRefresh}
            />,
        );

        fireEvent.change(
            screen.getByPlaceholderText(
                'Search by ID, symbol, or trader...',
            ),
            {
                target: { value: 'AAPL' },
            },
        );

        fireEvent.change(screen.getByDisplayValue('All Sides'), {
            target: { value: 'SELL' },
        });

        fireEvent.change(screen.getByDisplayValue('All Statuses'), {
            target: { value: 'CANCELLED' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /Refresh/ }),
        );

        expect(onSearchChange).toHaveBeenCalledWith('AAPL');
        expect(onSideChange).toHaveBeenCalledWith('SELL');
        expect(onStatusChange).toHaveBeenCalledWith('CANCELLED');
        expect(onRefresh).toHaveBeenCalled();
    });
});