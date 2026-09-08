import { useMemo, useState } from 'react';

import type { Trade } from '../../types/trade';
import './TradeTable.css';

interface TradeTableProps {
    trades: Trade[];
    onAmend: (trade: Trade) => void;
    onCancel: (trade: Trade) => void;
}

type SortColumn =
    | 'tradeTimestamp'
    | 'symbol'
    | 'side'
    | 'quantity'
    | 'price'
    | 'trader'
    | 'status';

type SortDirection = 'asc' | 'desc';

interface SortState {
    column: SortColumn;
    direction: SortDirection;
}

function formatTradeDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
}

function compareValues(
    a: Trade,
    b: Trade,
    column: SortColumn,
): number {
    switch (column) {
        case 'tradeTimestamp':
            return (
                new Date(a.tradeTimestamp).getTime() -
                new Date(b.tradeTimestamp).getTime()
            );

        case 'quantity':
            return a.quantity - b.quantity;

        case 'price':
            return a.price - b.price;

        case 'symbol':
            return a.symbol.localeCompare(b.symbol);

        case 'side':
            return a.side.localeCompare(b.side);

        case 'trader':
            return a.trader.localeCompare(b.trader);

        case 'status':
            return a.status.localeCompare(b.status);

        default:
            return 0;
    }
}

export function TradeTable({
    trades,
    onAmend,
    onCancel,
}: TradeTableProps) {

    const [sort, setSort] = useState<SortState>({
        column: 'tradeTimestamp',
        direction: 'desc',
    });

    const sortedTrades = useMemo(() => {
        return [...trades].sort((a, b) => {
            const result = compareValues(
                a,
                b,
                sort.column,
            );

            return sort.direction === 'asc'
                ? result
                : -result;
        });
    }, [trades, sort]);

    function handleSort(column: SortColumn) {
        setSort((currentSort) => {
            if (currentSort.column === column) {
                return {
                    column,
                    direction:
                        currentSort.direction === 'asc'
                            ? 'desc'
                            : 'asc',
                };
            }

            return {
                column,
                direction: 'asc',
            };
        });
    }

    function renderSortIndicator(
        column: SortColumn,
    ) {
        if (sort.column !== column) {
            return null;
        }

        return (
            <span className="sort-indicator">
                {sort.direction === 'asc' ? '↑' : '↓'}
            </span>
        );
    }

    if (trades.length === 0) {
        return (
            <div className="trade-table-empty">
                No trades found.
            </div>
        );
    }

    return (
        <div className="trade-table-container">
            <table className="trade-table">
                <thead>
                    <tr>
                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort(
                                        'tradeTimestamp',
                                    )
                                }
                            >
                                Trade Date
                                {renderSortIndicator(
                                    'tradeTimestamp',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('symbol')
                                }
                            >
                                Symbol
                                {renderSortIndicator(
                                    'symbol',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('side')
                                }
                            >
                                Side
                                {renderSortIndicator(
                                    'side',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('quantity')
                                }
                            >
                                Quantity
                                {renderSortIndicator(
                                    'quantity',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('price')
                                }
                            >
                                Price
                                {renderSortIndicator(
                                    'price',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('trader')
                                }
                            >
                                Trader
                                {renderSortIndicator(
                                    'trader',
                                )}
                            </button>
                        </th>

                        <th>
                            <button
                                type="button"
                                className="sort-button"
                                onClick={() =>
                                    handleSort('status')
                                }
                            >
                                Status
                                {renderSortIndicator(
                                    'status',
                                )}
                            </button>
                        </th>

                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedTrades.map((trade) => (
                        <tr key={trade.id}>
                            <td>
                                {formatTradeDate(
                                    trade.tradeTimestamp,
                                )}
                            </td>

                            <td>{trade.symbol}</td>

                            <td>
                                <span
                                    className={
                                        trade.side === 'BUY'
                                            ? 'trade-side-buy'
                                            : 'trade-side-sell'
                                    }
                                >
                                    {trade.side}
                                </span>
                            </td>

                            <td>
                                {trade.quantity.toLocaleString()}
                            </td>

                            <td>
                                {trade.price.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    },
                                )}
                            </td>

                            <td>{trade.trader}</td>
                            <td>
                                <span
                                    className={
                                        trade.status ===
                                            'ACTIVE'
                                            ? 'trade-status-active'
                                            : 'trade-status-cancelled'
                                    }
                                >
                                    {trade.status}
                                </span>
                            </td>

                            <td>
                                {trade.status ===
                                    'ACTIVE' ? (
                                    <div className="trade-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onAmend(trade)
                                            }
                                        >
                                            Amend
                                        </button>

                                        <button
                                            type="button"
                                            className="trade-cancel-button"
                                            onClick={() =>
                                                onCancel(trade)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <span className="trade-no-actions">
                                        —
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}