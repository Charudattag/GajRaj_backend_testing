import express from 'express';
import {
  addBanner,
  getAllBanners,
  updateBanner,
} from '../controllers/bannerController.js';
import { uploadFiles } from '../utils/multer.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/addBanner',
  uploadFiles,
  authMiddleware,
  adminMiddleware,
  addBanner,
);
router.get('/getAllBanners', authMiddleware, adminMiddleware, getAllBanners);
router.put(
  '/updateBanner/:id',
  uploadFiles,
  authMiddleware,
  adminMiddleware,
  updateBanner,
);

export default router;
