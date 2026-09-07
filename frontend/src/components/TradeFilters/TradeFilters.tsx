import type { TradeSide, TradeStatus } from '../../types/trade'
import './TradeFilters.css';

interface TradeFiltersProps {
  search: string;
  side: TradeSide | 'ALL';
  status: TradeStatus | 'ALL';
  onSearchChange: (value: string) => void;
  onSideChange: (value: TradeSide | 'ALL') => void;
  onStatusChange: (value: TradeStatus | 'ALL') => void;
  onRefresh: () => void;
}

export function TradeFilters({
  search,
  side,
  status,
  onSearchChange,
  onSideChange,
  onStatusChange,
  onRefresh,
}: TradeFiltersProps) {
  return (
    <div className="trade-filters">
      <input
        className="trade-filters-search"
        type="text"
        placeholder="Search by ID, symbol, or trader..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <select
        value={side}
        onChange={(event) =>
          onSideChange(event.target.value as TradeSide | 'ALL')
        }
      >
        <option value="ALL">All Sides</option>
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as TradeStatus | 'ALL')
        }
      >
        <option value="ALL">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <button type="button" onClick={onRefresh}>
        ↻ Refresh
      </button>
    </div>
  );
}