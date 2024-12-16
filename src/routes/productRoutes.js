import express from 'express';
import { addProduct,getAllProducts,updateProductById } from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadFiles } from '../utils/multer.js';

const router = express.Router();

// Add new product to the database
router.post('/addproduct',uploadFiles,authMiddleware,adminMiddleware, addProduct);

// get all products
router.get('/getallproducts',authMiddleware,adminMiddleware,getAllProducts)

router.put('/updatebyid/:id',uploadFiles,authMiddleware,adminMiddleware,updateProductById)



export default router;

