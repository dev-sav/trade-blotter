import { useState } from 'react';

import { cancelTrade } from '../../services/tradeService';
import type { Trade } from '../../types/trade';

import './CancelTradeDialog.css';

interface CancelTradeDialogProps {
  trade: Trade;
  currentUserId: number | null;
  onCancelled: (trade: Trade) => void;
  onCancel: () => void;
}

function CancelTradeDialog({
  trade,
  currentUserId,
  onCancelled,
  onCancel,
}: CancelTradeDialogProps) {
  const [error, setError] = useState<string | null>(
    null,
  );

  const [cancelling, setCancelling] = useState(false);

  async function handleConfirm() {
    setError(null);


    if (currentUserId === null) {
      setError('Please select a current user');
      return;
    }

    setCancelling(true);



    try {
      const cancelledTrade = await cancelTrade(
        trade.id,
        currentUserId
      );

      onCancelled(cancelledTrade);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to cancel trade',
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="cancel-dialog-backdrop">
      <div
        className="cancel-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-trade-title"
      >
        <h2 id="cancel-trade-title">
          Cancel Trade?
        </h2>

        <p>
          Are you sure you want to cancel trade #
          {trade.id} ({trade.symbol})?
        </p>

        <p className="cancel-dialog-warning">
          This action cannot be undone.
        </p>

        {error && (
          <div className="cancel-dialog-error">
            {error}
          </div>
        )}

        <div className="cancel-dialog-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={cancelling}
          >
            Keep Trade
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => void handleConfirm()}
            disabled={cancelling}
          >
            {cancelling
              ? 'Cancelling...'
              : 'Cancel Trade'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelTradeDialog;