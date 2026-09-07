import { useState, type FormEvent } from 'react';

import {
  amendTrade,
  type CreateTradeRequest,
} from '../../services/tradeService';

import type {
  Trade,
  TradeSide,
} from '../../types/trade';

import './AmendTradeForm.css';

interface AmendTradeFormProps {
  trade: Trade;
  onUpdated: (trade: Trade) => void;
  onCancel: () => void;
}

function AmendTradeForm({
  trade,
  onUpdated,
  onCancel,
}: AmendTradeFormProps) {
  const [symbol, setSymbol] = useState(trade.symbol);
  const [quantity, setQuantity] = useState(
    String(trade.quantity),
  );
  const [price, setPrice] = useState(
    String(trade.price),
  );
  const [side, setSide] = useState<TradeSide>(
    trade.side,
  );
  const [trader, setTrader] = useState(trade.trader);

  const [tradeTimestamp, setTradeTimestamp] =
    useState(
      new Date(trade.tradeTimestamp)
        .toISOString()
        .slice(0, 16),
    );

  const [error, setError] = useState<string | null>(
    null,
  );

  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (!symbol.trim()) {
      setError('Symbol is required');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (!price || Number(price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (!trader.trim()) {
      setError('Trader is required');
      return;
    }

    const payload: CreateTradeRequest = {
      symbol: symbol.trim().toUpperCase(),
      quantity: Number(quantity),
      price: Number(price),
      side,
      trader: trader.trim(),
      tradeTimestamp: new Date(
        tradeTimestamp,
      ).toISOString(),
    };

    try {
      setSaving(true);

      const updatedTrade = await amendTrade(
        trade.id,
        payload,
      );

      onUpdated(updatedTrade);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to amend trade',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Amend Trade</h2>

            <p>
              Update trade #{trade.id}.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            aria-label="Close"
            disabled={saving}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Symbol
              <input
                value={symbol}
                onChange={(event) =>
                  setSymbol(event.target.value)
                }
                maxLength={20}
              />
            </label>

            <label>
              Side
              <select
                value={side}
                onChange={(event) =>
                  setSide(
                    event.target.value as TradeSide,
                  )
                }
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
              />
            </label>

            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
              />
            </label>

            <label>
              Trader
              <input
                value={trader}
                onChange={(event) =>
                  setTrader(event.target.value)
                }
              />
            </label>

            <label>
              Trade Date
              <input
                type="datetime-local"
                value={tradeTimestamp}
                onChange={(event) =>
                  setTradeTimestamp(
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AmendTradeForm;