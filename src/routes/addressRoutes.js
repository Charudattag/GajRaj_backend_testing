import express from 'express';
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';

import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/addAddress', authMiddleware, addAddress);
router.get('/:id/getaddress', authMiddleware, getAddresses);
router.put('/updateAddress/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);

export default router;
