import express from 'express';
import {
  addSubcategory,
  getAllSubcategories,
  updateSubcategory,
  getAllSubcategoryByCategoryId,
} from '../controllers/subcategoryController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadFiles } from '../utils/multer.js';
const router = express.Router();

router.post(
  '/addSubcategory',
  uploadFiles,
  authMiddleware,
  adminMiddleware,
  addSubcategory,
);
router.get(
  '/getAllSubcategories',
  authMiddleware,
  adminMiddleware,
  getAllSubcategories,
);
router.put(
  '/updateSubcategory/:id',
  authMiddleware,
  adminMiddleware,
  updateSubcategory,
);
router.get(
  '/getAllSubcategoryByCategoryId/:category_id',
  authMiddleware,
  adminMiddleware,
  getAllSubcategoryByCategoryId,
);

export default router;
