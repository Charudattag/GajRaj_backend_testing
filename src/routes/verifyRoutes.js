import express from 'express';
import {
  sendEmailOtp,
  verifyOtp,
} from '../controllers/verificationController.js';

import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/sendEmailOtp', authMiddleware, sendEmailOtp);
router.post('/verifyOtp', authMiddleware, verifyOtp);
// router.put('/updateAddress/:id', authMiddleware, updateAddress);
// router.delete('/:id', authMiddleware, deleteAddress);

export default router;
