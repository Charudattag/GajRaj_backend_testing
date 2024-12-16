import { where } from 'sequelize';
import socialMediaLinks from '../models/socialMediaLinks.js';

export const AddSocialMediaLinks = async (req, res) => {
  const { name, url } = req.body;
  const loggedInUserId = req.user.id;

  const existingSocialMediaLinks = await socialMediaLinks.findOne({
    where: { name },
  });

  try {
    // check if Social media links already exist
    if (existingSocialMediaLinks) {
      return res
        .status(400)
        .json({ message: 'Social media link with this name already exists' });
    }

    // create new social media link
    const newSocialMediaLink = await socialMediaLinks.create({
      name,
      url,
      createdBy:loggedInUserId,
      updatedBy: loggedInUserId,
    });
    res.status(201).json({
      message: 'Social media link added successfully',
      data: newSocialMediaLink,
      success: true,
    });
  } catch (error) {
    console.error('Error adding social media link:', error);
    res.status(500).json({ error: 'Server error', success: false });
  }
};

export const GetSocialMediaLinks = async (req, res) => {
  try {
    // Pagination and limit parameters
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch social media links with pagination and sorting
    const socialMediaLink = await socialMediaLinks.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const totalRecords = await socialMediaLinks.count();
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      message: 'Social media links fetched successfully',
      data: socialMediaLinks,
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching social media links:', error);
    res.status(500).json({ error: 'Server error', success: false });
  }
};

export const updateSocialMediaLinks = async (req, res) => {
  const { id } = req.params;
  const { name, url } = req.body;
  const loggedInUserId = req.user.id;

  try {
    const socialMediaLink = await socialMediaLinks.findByPk(id);
    if (!socialMediaLink) {
      return res.status(404).json({ message: 'Social media link not found' });
    }
    if (name) {
      const existingSocialMediaLinks = await socialMediaLinks.findOne({
        where: { name }
      });
      if (existingSocialMediaLinks && existingSocialMediaLinks.id !== id) {
        return res
          .status(400)
          .json({ message: 'Social media link with this name already exists' });
      }
    }
    socialMediaLink.name = name || socialMediaLink.name;
    socialMediaLink.url = url || socialMediaLink.url;
    socialMediaLink.updatedBy = loggedInUserId;

    await socialMediaLink.save();

    res.status(200).json({
      message: 'Social media link updated successfully',
      data: socialMediaLink,
      success: true,
    });
  } catch (error) {r
    console.error('Error finding social media link:', error);
    res.status(500).json({ error: 'Server error', success: false });
  }
};
