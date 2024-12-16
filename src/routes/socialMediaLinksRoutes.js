import express from 'express';
import { AddSocialMediaLinks,GetSocialMediaLinks,updateSocialMediaLinks } from '../controllers/socialMediaLinks.js';
import { authMiddleware,adminMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.post('/addsocialmedia', authMiddleware,adminMiddleware,AddSocialMediaLinks);

router.get('/getsocialmedia', authMiddleware,adminMiddleware, GetSocialMediaLinks);

router.put('/updatesocialmedia/:id', authMiddleware, adminMiddleware, updateSocialMediaLinks);


export default router;