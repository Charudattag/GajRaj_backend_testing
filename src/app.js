import express from 'express';
import cors from 'cors'; // Import CORS middleware
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subcategoryRoutes from './routes/subcategoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import SocialMediaLinksRoutes from './routes/socialMediaLinksRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import rateRoutes from './routes/rateRoutes.js';
import sequelize from './config/db.js';

dotenv.config();

const app = express();

// CORS Middleware Configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  }),
);

app.use(express.json());

// User routes
app.use('/api/user', userRoutes);

// Category and subcategory routes
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);

// Product routes
app.use('/api/product', productRoutes);
app.use('/api/banner', bannerRoutes);

// Social media routes
app.use('/api/social', SocialMediaLinksRoutes);

// Customer routes
app.use('/api/customer', customerRoutes);

// Inquiry routes
app.use('/api/inquiries', inquiryRoutes);

// Address routes
app.use('/api/customer/address', addressRoutes);

// Verify routes
app.use('/api/customer/verify', verifyRoutes);
app.use('/api/productrate', rateRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
