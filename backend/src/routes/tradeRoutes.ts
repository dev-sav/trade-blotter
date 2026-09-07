import { Router } from 'express';

import {
  amendTradeController,
  cancelTradeController,
  createTradeController,
  getTradesController,
} from '../controllers/tradeController.js';

const router = Router();

router.get('/', getTradesController);

router.post('/', createTradeController);

router.patch('/:id', amendTradeController);

router.post('/:id/cancel', cancelTradeController);

export default router;