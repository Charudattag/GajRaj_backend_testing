import express from 'express';
import {
  addCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/categoryController.js';

const router = express.Router();
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadFiles } from '../utils/multer.js';

// Create a new category
router.post(
  '/addCategory',
  uploadFiles,
  authMiddleware,
  adminMiddleware,
  addCategory,
);
router.get(
  '/getAllCategories',
  authMiddleware,
  adminMiddleware,
  getAllCategories,
);
router.put(
  '/updateCategory/:id',
  authMiddleware,
  adminMiddleware,
  updateCategory,
);

export default router;
