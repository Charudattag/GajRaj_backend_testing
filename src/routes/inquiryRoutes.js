import express from 'express';
import {
  addInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
const router = express.Router();

router.post('/addInquiry', authMiddleware, adminMiddleware, addInquiry);
router.get(
  '/getAllInquiries',
  authMiddleware,
  adminMiddleware,
  getAllInquiries,
);

router.get(
  '/getInquiryById/:id',
  authMiddleware,
  adminMiddleware,
  getInquiryById,
);

router.put('/:id/status', authMiddleware, adminMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteInquiry);

export default router;
