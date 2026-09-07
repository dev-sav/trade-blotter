export interface CreateTradeRequest {
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
  trader: string;
  tradeTimestamp: string;
}

export function validateCreateTradeRequest(
  body: unknown,
): { valid: true; data: CreateTradeRequest } | {
  valid: false;
  message: string;
} {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      message: 'Request body is required',
    };
  }

  const request = body as Record<string, unknown>;

  if (
    typeof request.symbol !== 'string' ||
    request.symbol.trim() === ''
  ) {
    return {
      valid: false,
      message: 'Symbol is required',
    };
  }

  if (
    typeof request.quantity !== 'number' ||
    !Number.isInteger(request.quantity) ||
    request.quantity <= 0
  ) {
    return {
      valid: false,
      message: 'Quantity must be a positive integer',
    };
  }

  if (
    typeof request.price !== 'number' ||
    !Number.isFinite(request.price) ||
    request.price <= 0
  ) {
    return {
      valid: false,
      message: 'Price must be a positive number',
    };
  }

  if (
    request.side !== 'BUY' &&
    request.side !== 'SELL'
  ) {
    return {
      valid: false,
      message: 'Side must be BUY or SELL',
    };
  }

  if (
    typeof request.trader !== 'string' ||
    request.trader.trim() === ''
  ) {
    return {
      valid: false,
      message: 'Trader is required',
    };
  }

  if (
    typeof request.tradeTimestamp !== 'string' ||
    Number.isNaN(Date.parse(request.tradeTimestamp))
  ) {
    return {
      valid: false,
      message: 'Trade timestamp must be a valid date',
    };
  }

  return {
    valid: true,
    data: {
      symbol: request.symbol.trim().toUpperCase(),
      quantity: request.quantity,
      price: request.price,
      side: request.side,
      trader: request.trader.trim(),
      tradeTimestamp: request.tradeTimestamp,
    },
  };
}


///  AMMEND  ///

 export interface AmendTradeRequest {
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
  trader: string;
  tradeTimestamp: string;
}

export function validateAmendTradeRequest(
  body: unknown,
): { valid: true; data: AmendTradeRequest } | {
  valid: false;
  message: string;
} {
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      message: 'Request body is required',
    };
  }

  const request = body as Record<string, unknown>;

  if (
    typeof request.symbol !== 'string' ||
    request.symbol.trim() === ''
  ) {
    return {
      valid: false,
      message: 'Symbol is required',
    };
  }

  if (
    typeof request.quantity !== 'number' ||
    !Number.isInteger(request.quantity) ||
    request.quantity <= 0
  ) {
    return {
      valid: false,
      message: 'Quantity must be a positive integer',
    };
  }

  if (
    typeof request.price !== 'number' ||
    !Number.isFinite(request.price) ||
    request.price <= 0
  ) {
    return {
      valid: false,
      message: 'Price must be a positive number',
    };
  }

  if (
    request.side !== 'BUY' &&
    request.side !== 'SELL'
  ) {
    return {
      valid: false,
      message: 'Side must be BUY or SELL',
    };
  }

  if (
    typeof request.trader !== 'string' ||
    request.trader.trim() === ''
  ) {
    return {
      valid: false,
      message: 'Trader is required',
    };
  }

  if (
    typeof request.tradeTimestamp !== 'string' ||
    Number.isNaN(Date.parse(request.tradeTimestamp))
  ) {
    return {
      valid: false,
      message: 'Trade timestamp must be a valid date',
    };
  }

  return {
    valid: true,
    data: {
      symbol: request.symbol.trim().toUpperCase(),
      quantity: request.quantity,
      price: request.price,
      side: request.side,
      trader: request.trader.trim(),
      tradeTimestamp: request.tradeTimestamp,
    },
  };
}