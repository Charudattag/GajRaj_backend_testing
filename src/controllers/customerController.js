import Customer from '../models/customer.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils.js';
import { Op } from 'sequelize';

// Creating a new customer
export const createCustomer = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  // // Validate required fields
  if (!name || !email || !password || !mobile) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingCustomer = await Customer.findOne({ where: { mobile } });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newCustomer = await Customer.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    // Generate JWT token

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// update customer
export const updateCustomerById = async (req, res) => {
  const { id } = req.params;
  const { name, mobile, email, password } = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: 'customer not found' });
    }

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : customer.password;

    // Update user
    customer.name = name || customer.name;
    customer.mobile = mobile || customer.mobile;
    customer.email = email || customer.email;
    customer.password = hashedPassword || customer.password;

    // Save the updated user
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'customer updated successfully',
      data: {
        role: customer.role,
        email: customer.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// get customer by ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      message: 'Customer Fetched successfully',
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// get all customers

export const getAllCustomers = async (req, res) => {
  try {
    // Get page and limit from query parameters (with default values)
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch users with pagination
    const { count, rows: customer } = await Customer.findAndCountAll({
      limit,
      offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Respond with paginated data
    res.status(200).json({
      success: true,
      data: customer,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages,
        pageSize: customer.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// login Customer

export const login = async (req, res) => {
  const { email, mobile, password } = req.body;

  if (!(email || mobile) || !password) {
    return res.status(400).json({
      message: 'Email or mobile and password are required.',
      success: false,
    });
  }

  const identifier = email || mobile; // Use email if present, otherwise use mobile

try {
    const customer = await Customer.findOne({
        where: {
            [Op.or]: [
                { email: identifier },
                { mobile: identifier },
            ],
        },
    });

    if (!customer) {
        return res.status(404).json({
            message: 'User not found.',
            success: false,
        });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials.',
        success: false,
      });
    }

    // Generate a JWT or perform the login action
    const accessToken = generateToken(
      {
        id: customer.id,
        email:customer.email,
        mobile:customer.mobile
      },
      '1h',
    );
    const refreshToken = generateToken(
      {
        id: customer.id,
        email: customer.email,
      },
      '7d',
    );
    

    res.status(200).json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
};
  
