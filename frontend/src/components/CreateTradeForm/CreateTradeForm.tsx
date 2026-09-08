import { useState } from 'react';

import {
  createTrade,
  type CreateTradeRequest,
} from '../../services/tradeService';
import type { Trade } from '../../types/trade';
import './CreateTradeForm.css'

interface CreateTradeFormProps {
  currentUserId: number | null;
  onCreated: (trade: Trade) => void;
  onCancel: () => void;
}

function CreateTradeForm({
  currentUserId,
  onCreated,
  onCancel,
}: CreateTradeFormProps) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [trader, setTrader] = useState('');
  const [tradeTimestamp, setTradeTimestamp] = useState(
    new Date().toISOString().slice(0, 16),
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
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

    if (currentUserId === null) {
      setError('Please select a current user');
      return;
    }

    const payload: CreateTradeRequest = {
      userId: currentUserId,
      symbol: symbol.trim().toUpperCase(),
      quantity: Number(quantity),
      price: Number(price),
      side,
      trader: trader.trim(),
      tradeTimestamp: new Date(tradeTimestamp).toISOString(),
    };

    try {
      setSaving(true);

      const createdTrade = await createTrade(payload);

      onCreated(createdTrade);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create trade',
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
            <h2>Create Trade</h2>
            <p>Enter the details for the new trade.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            aria-label="Close"
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
                placeholder="AAPL"
                maxLength={20}
              />
            </label>

            <label>
              Side
              <select
                value={side}
                onChange={(event) =>
                  setSide(
                    event.target.value as 'BUY' | 'SELL',
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
                placeholder="100"
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
                placeholder="182.43"
              />
            </label>

            <label>
              Trader
              <input
                value={trader}
                onChange={(event) =>
                  setTrader(event.target.value)
                }
                placeholder="Trader name"
              />
            </label>

            <label>
              Trade Date
              <input
                type="datetime-local"
                value={tradeTimestamp}
                onChange={(event) =>
                  setTradeTimestamp(event.target.value)
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
              {saving ? 'Creating...' : 'Create Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTradeForm;