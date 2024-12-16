import express from 'express';
import {
  addRate,
  getRateByDate,
  getAllRates,
  updateRate,
} from '../controllers/rateController.js';

import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/addRate', authMiddleware, adminMiddleware, addRate);
router.get('/getRateByDate/:date', authMiddleware, getRateByDate);
// GET /getRateByDate/2024-12-13

router.get('/getAllRates', authMiddleware, getAllRates);
router.post('/updateRate/:id', authMiddleware, adminMiddleware, updateRate);

export default router;
