import Product from '../models/Products.js';
import Category from '../models/categories.js';
import Subcategory from '../models/subcategories.js';
import { Sequelize } from 'sequelize';
import Rate from '../models/rate.js';

export const addProduct = async (req, res) => {
  const {
    name,
    category_id,
    subcategory_id,
    description,
    stock,
    Weight,
    shipping,
    packaging,
    making_Charges,
    type,
    GstPercentage,
    making_charges_type,
  } = req.body;

  const loggedInUserId = req.user.id;

  try {
    
    const existingProduct = await Product.findOne({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: 'Product with the same name already exists.',
      });
    }

    
    const latestRate = await Rate.findOne({
      order: [['createdAt', 'DESC']],
    });

    if (!latestRate) {
      return res.status(404).json({
        success: false,
        error: 'Rate not found. Please add the gold and silver rates first.',
      });
    }

    const baseRate = type === 'Gold' ? latestRate.Gold : latestRate.Silver;

    if (!baseRate) {
      return res.status(400).json({
        success: false,
        error: `Rate for product type ${type} is not available.`,
      });
    }

    const making_percent = making_Charges / 100;

    // Calculate the making charges based on type
    let makingChargeAmount = 0;
    if (making_charges_type === 'percentage') {
      // If it's a percentage, calculate based on the price (baseRate * Weight)
      makingChargeAmount = (baseRate * Weight * making_percent) / 100;

      // console.log(makingChargeAmount,"Making");
    } else if (making_charges_type === 'per_gram') {
      // If it's per gram, calculate based on the weight
      makingChargeAmount = making_Charges * Weight;
    } else {
      return res.status(400).json({
        success: false,
        error:
          'Invalid making charges type. It should be either "percentage" or "per_gram".',
      });
    }

    // Calculate base price, GST, and total price
    const basePrice = baseRate * Weight;

    const gstAmount = (basePrice * GstPercentage) / 100;
    const totalPrice =
      basePrice +
      parseFloat(gstAmount) +
      parseFloat(packaging) +
      parseFloat(shipping) +
      parseFloat(makingChargeAmount);

    console.log(baseRate, 'baseRate');
    console.log(Weight, 'Weight');
    console.log(basePrice, 'basePrice');
    console.log(gstAmount, 'gstAmount');
    console.log(GstPercentage, 'GstPercentage');
    console.log(makingChargeAmount, 'makingChargeAmount');
    console.log(totalPrice, 'totalPrice');

    const finalPrice = parseFloat(totalPrice).toFixed(2);

    console.log(finalPrice, 'finalPrice');

    const newProduct = await Product.create({
      name,
      category_id,
      subcategory_id,
      price: finalPrice,
      description,
      stock,
      Weight,
      shipping,
      packaging,
      making_Charges: making_Charges,
      making_charges_type,
      type,
      GstPercentage,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({
      success: false,
      error: 'An error occurred while adding the product. Please try again.',
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const currentPage = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const offset = (currentPage - 1) * pageLimit;

    const whereCondition = search
      ? {
          name: {
            [Sequelize.Op.iLike]: `%${search}%`,
          },
        }
      : {};

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['id', 'name'],
        },
      ],
      where: whereCondition,
      limit: pageLimit,
      offset: offset,
    });

    const totalRecords = await Product.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalRecords / pageLimit);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully.',
      data: products,
      pagination: {
        totalRecords, // Total number of products
        totalPages, // Total number of pages
        currentPage, // Current page
        pageLimit, // Limit per page
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error.message); // Log the specific error message
    res.status(500).json({
      error: 'An error occurred while fetching products',
      success: false,
    });
  }
};

export const updateProductById = async (req, res) => {
  const { id } = req.params; // Get the product ID from the URL parameters
  const { name, category_id, subcategory_id, price, description, stock } =
    req.body;

  const loggedInUserId = req.user.id;

  try {
    // Find the product by ID
    const product = await Product.findByPk(id); // Assuming 'id' is the primary key for the product model

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.',
      });
    }

    // Access the uploaded files from Multer (if any) and extract only the filenames
    const imageArray = req.files['images']
      ? req.files['images'].map((file) => file.filename)
      : [];
    const videoArray = req.files['videos']
      ? req.files['videos'].map((file) => file.filename)
      : [];

    // Log received data to check if there are any issues
    console.log('Received images filenames:', imageArray);
    console.log('Received videos filenames:', videoArray);

    // Update product details
    product.name = name || product.name;
    product.category_id = category_id || product.category_id;
    product.subcategory_id = subcategory_id || product.subcategory_id;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock || product.stock;
    product.image =
      imageArray.length > 0 ? JSON.stringify(imageArray) : product.image;
    product.videos =
      videoArray.length > 0 ? JSON.stringify(videoArray) : product.videos;
    product.updatedBy = loggedInUserId;

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the product. Please try again.',
    });
  }
};
