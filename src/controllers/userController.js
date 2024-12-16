import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils.js';
// import logger from "../logs/logger.js";
import User from '../models/user.js'; // Sequelize User model

/**
 * Fetch all users
 */
export const getAllUsers = async (req, res) => {
  try {
    // Get page and limit from query parameters (with default values)
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where:{is_active: true},
      limit,
      offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Respond with paginated data
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages,
        pageSize: users.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Create a new user
 */

export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      is_active: true,
    });

    // Generate JWT token

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get details of a single user
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // logger.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update user details
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role, is_active } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    // Update user
    await user.update({ role, email, password: hashedPassword, is_active });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        role: user.role,
        email: user.email,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    // logger.error("Error updating user:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Set the status to false instead of deleting the user
    user.is_active = false;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'User status updated to inactive' });
  } catch (error) {
    // logger.error("Error updating user status:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// export const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: 'User not found' });
//     }

//     await user.destroy();
//     res
//       .status(200)
//       .json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     // logger.error("Error deleting user:", error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the employee by username
    const Users = await User.findOne({ where: { email } });
    if (!Users) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare entered password with hashed password in the database
    const validPassword = await bcrypt.compare(password, Users.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateToken(
      {
        id: Users.id,
        email: Users.email,
        is_active: Users.is_active,
        role: Users.role,
      },
      '1h',
    );
    const refreshToken = generateToken(
      {
        id: Users.id,
        email: Users.email,
      },
      '7d',
    );

    res
      .status(200)
      .json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
