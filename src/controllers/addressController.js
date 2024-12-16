import jwt from 'jsonwebtoken';
import Customer from '../models/customer.js';
import Address from '../models/address.js';

const addAddress = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer_id = decoded.id;

    const {
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!address_line_1 || !city || !state || !pincode) {
      return res.status(400).json({
        message: 'Address line 1, city, state, and pincode are required.',
        success: false,
      });
    }

    const existingAddress = await Address.findOne({
      where: {
        customer_id,
      },
    });

    if (existingAddress) {
      return res.status(400).json({
        message: 'Address already exists for this customer.',
        success: false,
      });
    }

    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found.',
        success: false,
      });
    }

    const newAddress = await Address.create({
      customer_id,
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      country,
      createdBy: customer_id,
      updatedBy: customer_id,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      data: newAddress,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address.',
      error: error.message,
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const customer_id = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found.',
        success: false,
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Address.findAndCountAll({
      where: { customer_id },
      limit: parseInt(limit), // Ensure limit is an integer
      offset: parseInt(offset), // Ensure offset is an integer
    });

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'No addresses found for this customer.',
        success: false,
      });
    }

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        totalRecords: count,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve addresses.',
      error: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address_id = req.params.id;

    const {
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!address_line_1 || !city || !state || !pincode) {
      return res.status(400).json({
        message: 'Address line 1, city, state, and pincode are required.',
        success: false,
      });
    }

    const address = await Address.findOne({
      where: { id: address_id },
    });

    if (!address) {
      return res.status(404).json({
        message: 'Address not found.',
        success: false,
      });
    }

    const updatedAddress = await address.update({
      type,
      address_line_1,
      address_line_2,
      city,
      state,
      pincode,
      country,
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address.',
      error: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    // Get address_id from the request parameters
    const address_id = req.params.id;

    // Find the address by ID
    const address = await Address.findOne({
      where: { id: address_id },
    });

    // Check if the address exists
    if (!address) {
      return res.status(404).json({
        message: 'Address not found.',
        success: false,
      });
    }

    
    await address.destroy();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address.',
      error: error.message,
    });
  }
};

export { addAddress, getAddresses, updateAddress, deleteAddress };
