import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

describe('Trade API', () => {
  it('returns all trades', async () => {
    const response = await request(app)
      .get('/api/trades');

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('creates a trade', async () => {
    const newTrade = {
      symbol: 'AAPL',
      quantity: 100,
      price: 182.43,
      side: 'BUY',
      trader: 'Test Trader',
      tradeTimestamp: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/api/trades')
      .send(newTrade);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      symbol: 'AAPL',
      quantity: 100,
      price: 182.43,
      side: 'BUY',
      trader: 'Test Trader',
      status: 'ACTIVE',
    });

    expect(response.body.id).toEqual(expect.any(Number));
  });

  it('rejects an invalid trade', async () => {
    const response = await request(app)
      .post('/api/trades')
      .send({
        symbol: '',
        quantity: -10,
        price: 0,
        side: 'INVALID',
        trader: '',
        tradeTimestamp: 'not-a-date',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeTruthy();
  });

  it('amends an existing trade', async () => {
    const createResponse = await request(app)
      .post('/api/trades')
      .send({
        symbol: 'MSFT',
        quantity: 100,
        price: 400,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(createResponse.status).toBe(201);

    const tradeId = createResponse.body.id;

    const amendResponse = await request(app)
      .patch(`/api/trades/${tradeId}`)
      .send({
        symbol: 'MSFT',
        quantity: 250,
        price: 410,
        side: 'SELL',
        trader: 'Updated Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(amendResponse.status).toBe(200);

    expect(amendResponse.body).toMatchObject({
      id: tradeId,
      symbol: 'MSFT',
      quantity: 250,
      price: 410,
      side: 'SELL',
      trader: 'Updated Trader',
      status: 'ACTIVE',
    });
  });

  it('cancels an existing trade', async () => {
    const createResponse = await request(app)
      .post('/api/trades')
      .send({
        symbol: 'GOOGL',
        quantity: 50,
        price: 200,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(createResponse.status).toBe(201);

    const tradeId = createResponse.body.id;

    const cancelResponse = await request(app)
      .post(`/api/trades/${tradeId}/cancel`);

    expect(cancelResponse.status).toBe(200);

    expect(cancelResponse.body).toMatchObject({
      id: tradeId,
      status: 'CANCELLED',
    });
  });

  it('returns 404 when amending a nonexistent trade', async () => {
    const response = await request(app)
      .patch('/api/trades/999999')
      .send({
        symbol: 'AAPL',
        quantity: 100,
        price: 180,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Trade not found');
  });

  it('returns 404 when cancelling a nonexistent trade', async () => {
    const response = await request(app)
      .post('/api/trades/999999/cancel');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Trade not found');
  });

  it('rejects amending a cancelled trade', async () => {
    const createResponse = await request(app)
      .post('/api/trades')
      .send({
        symbol: 'AAPL',
        quantity: 100,
        price: 180,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    const tradeId = createResponse.body.id;

    await request(app)
      .post(`/api/trades/${tradeId}/cancel`);

    const amendResponse = await request(app)
      .patch(`/api/trades/${tradeId}`)
      .send({
        symbol: 'AAPL',
        quantity: 200,
        price: 190,
        side: 'SELL',
        trader: 'Updated Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(amendResponse.status).toBe(409);
    expect(amendResponse.body.message).toBe(
      'Cancelled trades cannot be amended',
    );
  });

  it('rejects cancelling an already cancelled trade', async () => {
    const createResponse = await request(app)
      .post('/api/trades')
      .send({
        symbol: 'TSLA',
        quantity: 50,
        price: 300,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    const tradeId = createResponse.body.id;

    const firstCancelResponse = await request(app)
      .post(`/api/trades/${tradeId}/cancel`);

    expect(firstCancelResponse.status).toBe(200);

    const secondCancelResponse = await request(app)
      .post(`/api/trades/${tradeId}/cancel`);

    expect(secondCancelResponse.status).toBe(409);
    expect(secondCancelResponse.body.message).toBe(
      'Trade is already cancelled',
    );
  });

  it('rejects an invalid trade ID', async () => {
    const amendResponse = await request(app)
      .patch('/api/trades/not-a-number')
      .send({
        symbol: 'AAPL',
        quantity: 100,
        price: 180,
        side: 'BUY',
        trader: 'Test Trader',
        tradeTimestamp: new Date().toISOString(),
      });

    expect(amendResponse.status).toBe(400);
    expect(amendResponse.body.message).toBe('Invalid trade ID');

    const cancelResponse = await request(app)
      .post('/api/trades/not-a-number/cancel');

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.message).toBe('Invalid trade ID');
  });
});