import express from 'express';
import {createCustomer,updateCustomerById,getCustomerById,getAllCustomers,login} from '../controllers/customerController.js'
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

// Create a new customer route
router.post('/createcustomer', createCustomer);

// Update a customer route
router.put('/updatecustomer/:id', authMiddleware,updateCustomerById);

// Get a customer by ID route
 router.get('/getcustomer/:id',authMiddleware, getCustomerById);

// Get all customers route
 router.get('/getallcustomers',authMiddleware, getAllCustomers);

 // login to customer
 router.post('/login', login);

export default router;