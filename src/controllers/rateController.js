import Rate from '../models/rate.js';
import User from '../models/user.js';

export const addRate = async (req, res) => {
  try {
    const { Gold, Silver } = req.body;
    const loggedInUserId = req.user.id;

    if (!Gold || !Silver) {
      return res.status(400).json({
        success: false,
        message: 'Gold and Silver rates are required.',
      });
    }

    const rateDate = new Date().toISOString().split('T')[0];

    const newRate = await Rate.create({
      Gold,
      Silver,
      rateDate,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    const latestRate = await Rate.findOne({
      order: [['createdAt', 'DESC']],
    });

    return res.status(201).json({
      success: true,
      message: 'Rate added successfully.',
      data: latestRate,
    });
  } catch (error) {
    console.error('Error adding rate:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

export const getAllRates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 2; // Fetch only the latest two records
    const offset = (page - 1) * limit;

    // Fetch the latest 2 categories, ordered by createdAt descending
    const rate = await Rate.findAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']], // Assuming createdAt is the timestamp field
    });

    const totalRecords = await Rate.count();
    const total = Math.ceil(totalRecords / limit);

    res.status(200).json({
      message: 'Latest categories retrieved successfully',
      data: rate,
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

export const getRateByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const rates = await Rate.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
    });

    if (!rates || rates.length === 0) {
      return res
        .status(404)
        .json({ message: 'No rates found for the specified date.' });
    }

    return res
      .status(200)
      .json({ message: 'Rates fetched successfully.', data: rates });
  } catch (error) {
    console.error('Error fetching rates by date:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateRate = async (req, res) => {
  const { id } = req.params;
  const { Gold, Silver } = req.body;

  try {
    const rate = await Rate.findByPk(id);
    if (!rate) {
      return res.status(404).json({ error: 'Category not found' });
    }

    rate.Gold = Gold || rate.Gold;
    rate.Silver = Silver || rate.Silver;

    await rate.save();

    res
      .status(200)
      .json({ message: 'Category updated successfully', data: rate });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the category' });
  }
};
