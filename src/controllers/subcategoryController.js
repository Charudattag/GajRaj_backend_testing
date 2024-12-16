import Subcategory from '../models/subcategories.js';
import Category from '../models/categories.js';

const addSubcategory = async (req, res) => {
  const { name, description, category_id } = req.body;
  const loggedInUserId = req.user.id;

  // must category_id is provided
  if (!category_id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  // Check if the category exists
  const categoryExists = await Category.findByPk(category_id);
  if (!categoryExists) {
    return res.status(404).json({ error: 'Category not found' });
  }

  

  // Check if a Subcategory with the same name already exists for this category
  const existingSubcategory = await Subcategory.findOne({
    where: {
      name,
      category_id,
      createdBy:loggedInUserId,
      updatedBy:loggedInUserId,
    },
  });

  if (existingSubcategory) {
    return res
      .status(400)
      .json({ error: 'Subcategory already exists in this category' });
  }


  const imageFilename = req.files?.images[0]?.filename;
  const bannerFilename = req.files?.SubCategory_banner?.[0]?.filename || null;

  try {
    const newSubcategory = await Subcategory.create({
      name,
      description,
      category_id,
      image:imageFilename,
      SubCategory_banner:bannerFilename,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    res.status(201).json({
      message: 'Subcategory added successfully',
      data: newSubcategory,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while adding the subcategory',
      success: false,
    });
  }
};

// **************** get all subcategories **********
const getAllSubcategories = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    // Fetch subcategories with pagination
    const subcategories = await Subcategory.findAll({
      limit: limit, // Limit number of results
      offset: offset, // Offset for pagination
    });

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found' });
    }

    // Get total number of subcategories for total pages calculation
    const totalRecords = await Subcategory.count();
    const total = Math.ceil(totalRecords / limit);

    // Send the subcategories as a response
    return res.status(200).json({
      message: 'Subcategories retrieved successfully',
      data: subcategories,
      pagination: {
        totalRecords,
        total,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ************** update subcategories ****************
const updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { name, category_id, description } = req.body;

  try {
    const subcategory = await Subcategory.findOne({
      where: { id },
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subcategory.name = name || subcategory.name;
    subcategory.category_id = category_id || subcategory.category_id;
    subcategory.description = description || subcategory.description;

    // Save the updated subcategory back to the database
    await subcategory.save();

    // Return the updated subcategory
    return res.status(200).json({ data: subcategory });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};





const getAllSubcategoryByCategoryId = async (req, res) => {
  const { category_id } = req.params;

  try {
    // Fetch all subcategories by category_id
    const subcategories = await Subcategory.findAll({
      where: {
        category_id: category_id,
      },
    });

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for this category' });
    }

    // Return the list of subcategories
    res.status(200).json({ data: subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching subcategories' });
  }
};




export { addSubcategory, getAllSubcategories, updateSubcategory ,getAllSubcategoryByCategoryId};
