import Category from '../models/categories.js';
import User from '../models/user.js';

// const addCategory = async (req, res) => {
//   const { name, description } = req.body;
//   const loggedInUserId = req.user.id;
//   console.log(req.body,"bodyyy");
//   // Validate that the category name is provided
//   if (!name) {
//     return res.status(400).json({ error: 'Category name is required' });
//   }

//   const userExists = await User.findByPk(loggedInUserId);
// console.log("User exists:", userExists);

//   try {
//     // Check if the category name already exists in the database

//     const existingCategory = await Category.findOne({ where: { name } });
//     if (existingCategory) {
//       return res.status(400).json({
//         error: 'Category already exists',
//         success: false,
//       });
//     }

//     // Create a new category if the name is unique
//     const newCategory = await Category.create({
//       name,
//       description,
//       createdBy: loggedInUserId,
//       updatedBy: loggedInUserId,
//     });

//     res.status(201).json({
//       message: 'Category added successfully',
//       category: newCategory,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: 'An error occurred while adding the category',
//       success: false,
//     });
//   }
// };

const addCategory = async (req, res) => {
  const { name, description } = req.body;
  const loggedInUserId = req.user.id;

  // console.log(loggedInUserId);

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        error: 'Category already exists',
        success: false,
      });
    }

    const imageFilename = req.files?.images[0]?.filename;
    const bannerFilename = req.files?.Category_Banner?.[0]?.filename || null;

    console.log(imageFilename,"lala",bannerFilename);
    // Create new category
    const newCategory = await Category.create({
      name,
      description,
      image: imageFilename,
      Category_Banner: bannerFilename,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    res.status(201).json({
      message: 'Category added successfully',
      data: newCategory,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred while adding the category1',
      success: false,
    });
  }
};

// **** get all categories ****************
const getAllCategories = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch categories with pagination
    const categories = await Category.findAll({
      limit: limit,
      offset: offset,
    });

    const totalRecords = await Category.count();
    const total = Math.ceil(totalRecords / limit);

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories,
      success: true,
      pagination: {
        totalRecords,
        total,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while retrieving categories',
      success: false,
    });
  }
};

// **************** Update categories ********

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    //  category exists with the given ID
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    //  new name already exists in another category
    if (name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory && existingCategory.id !== id) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res
      .status(200)
      .json({ message: 'Category updated successfully', data: category });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the category' });
  }
};

export { addCategory, getAllCategories, updateCategory };
