import { useEffect, useMemo, useState } from 'react';

import CreateTradeForm from './components/CreateTradeForm/CreateTradeForm'
import { TradeFilters } from './components/TradeFilters/TradeFilters';
import { TradeTable } from './components/TradeTable/TradeTable';
import { getTrades } from './services/tradeService';
import type { Trade, TradeSide, TradeStatus } from './types/trade';
import AmendTradeForm from './components/AmendTradeForm/AmendTradeForm'
import CancelTradeDialog from './components/CancelTradeDialog/CancelTradeDialog';

import {
  connectToTradeUpdates,
  type TradeEvent,
} from './services/websocketService';

import './App.css';

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [search, setSearch] = useState('');
  const [side, setSide] = useState<TradeSide | 'ALL'>('ALL');
  const [status, setStatus] = useState<TradeStatus | 'ALL'>('ALL');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);


  const [tradeToAmend, setTradeToAmend] =
    useState<Trade | null>(null);

  const [tradeToCancel, setTradeToCancel] =
    useState<Trade | null>(null);
  async function loadTrades() {
    setIsLoading(true);
    setError('');

    try {
      const data = await getTrades();
      setTrades(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load trades',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTrades();
  }, []);

  useEffect(() => {
    const disconnect = connectToTradeUpdates(handleTradeEvent);

    return disconnect;
  }, []);

  function handleTradeEvent(event: TradeEvent) {
    setTrades((currentTrades) => {
      switch (event.type) {
        case 'TRADE_CREATED':
          return [...currentTrades, event.trade];

        case 'TRADE_UPDATED':
        case 'TRADE_CANCELLED':
          return currentTrades.map((trade) =>
            trade.id === event.trade.id
              ? event.trade
              : trade,
          );

        default:
          return currentTrades;
      }
    });
  }

  const filteredTrades = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return trades.filter((trade) => {
      const matchesSearch =
        !normalizedSearch ||
        trade.id.toString().includes(normalizedSearch) ||
        trade.symbol.toLowerCase().includes(normalizedSearch) ||
        trade.trader.toLowerCase().includes(normalizedSearch);

      const matchesSide =
        side === 'ALL' || trade.side === side;

      const matchesStatus =
        status === 'ALL' || trade.status === status;

      return (
        matchesSearch &&
        matchesSide &&
        matchesStatus
      );
    });
  }, [trades, search, side, status]);

  return (
    <main className="app">
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1>Trade Blotter</h1>
            <p>View and manage executed trades.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
          >
            + New Trade
          </button>
        </header>

        <section className="app-content">
          <TradeFilters
            search={search}
            side={side}
            status={status}
            onSearchChange={setSearch}
            onSideChange={setSide}
            onStatusChange={setStatus}
            onRefresh={() => void loadTrades()}
          />

          {error && (
            <p className="app-error">
              {error}
            </p>
          )}

          {isLoading ? (
            <p>Loading trades...</p>
          ) : (
            <TradeTable
              trades={filteredTrades}
              onAmend={setTradeToAmend}
              onCancel={setTradeToCancel}
            />
          )}
        </section>
      </div>

      {showCreateForm && (
        <CreateTradeForm
          onCreated={(trade) => {
            setTrades((currentTrades) => [
              trade,
              ...currentTrades,
            ]);

            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {tradeToAmend && (
        <AmendTradeForm
          trade={tradeToAmend}
          onUpdated={(updatedTrade) => {
            setTrades((currentTrades) =>
              currentTrades.map((trade) =>
                trade.id === updatedTrade.id
                  ? updatedTrade
                  : trade,
              ),
            );

            setTradeToAmend(null);
          }}
          onCancel={() => setTradeToAmend(null)}
        />
      )}

      {tradeToCancel && (
        <CancelTradeDialog
          trade={tradeToCancel}
          onCancelled={(cancelledTrade) => {
            setTrades((currentTrades) =>
              currentTrades.map((trade) =>
                trade.id === cancelledTrade.id
                  ? cancelledTrade
                  : trade,
              ),
            );

            setTradeToCancel(null);
          }}
          onCancel={() => setTradeToCancel(null)}
        />
      )}
    </main>
  );
}

export default App;