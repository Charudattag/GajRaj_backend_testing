import Inquiry from '../models/inquiry.js';
import User from '../models/user.js';

const addInquiry = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;
    const loggedInUserId = req.user.id;

    if (!name || !email || !mobile) {
      return res
        .status(400)
        .json({ message: 'Name, email, and mobile are required.' });
    }

    // Check if inquiry already exists with the same email and subject
    const existingInquiry = await Inquiry.findOne({
      where: { email, subject },
    });

    if (existingInquiry) {
      return res.status(409).json({
        sucess: false,
        message: 'An inquiry with this email and subject already exists.',
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      mobile,
      subject,
      message,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    res.status(201).json({
      sucess: true,
      message: 'Inquiry added successfully.',
      data: inquiry,
    });
  } catch (error) {
    console.error({ 'Error adding inquiry:': error, sucess: false });
    res.status(500).json({
      message: 'Failed to add inquiry.',
      error: error.message,
      sucess: false,
    });
  }
};

const getAllInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: inquiries } = await Inquiry.findAndCountAll({
      where: { isActive: true },
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: 'Inquiries retrieved successfully.',
      data: inquiries,
      pagination: {
        totalRecords: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.error({ 'Error fetching inquiries:': error, sucess: false });
    res.status(500).json({
      message: 'Failed to fetch inquiries.',
      error: error.message,
      sucess: false,
    });
  }
};

const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findOne({
      where: { id },
    });

    if (!inquiry) {
      return res
        .status(404)
        .json({ message: 'Inquiry not found.', sucess: false });
    }

    res.status(200).json({
      message: 'Inquiry retrieved successfully.',
      sucess: true,
      data: inquiry,
    });
  } catch (error) {
    console.error({ 'Error retrieving inquiry:': error, sucess: false });
    res.status(500).json({
      message: 'Failed to retrieve inquiry.',
      error: error.message,
      sucess: false,
    });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;
    const loggedInUserId = req.user.id;

    const validStatuses = ['PENDING', 'IN-PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(Status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${validStatuses.join(', ')}.`,
      });
    }

    const inquiry = await Inquiry.findOne({ where: { id } });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    inquiry.set('Status', Status);
    inquiry.updatedBy = loggedInUserId;

    await inquiry.save();

    res.status(200).json({
      message: 'Inquiry status updated successfully.',
      sucess: true,
      data: {
        id: inquiry.id,
        Status: inquiry.Status,
        updatedBy: inquiry.updatedBy,
        updatedAt: inquiry.updatedAt,
      },
      sucess: true,
    });
  } catch (error) {
    console.error({ 'Error updating inquiry status:': error, sucess: false });
    res.status(500).json({
      message: 'Failed to update inquiry status.',
      error: error.message,
      sucess: false,
    });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id;

    const inquiry = await Inquiry.findOne({ where: { id, isActive: true } });

    if (!inquiry) {
      return res.status(404).json({
        message: 'Inquiry not found or already deleted.',
        sucess: false,
      });
    }

    // Mark the inquiry as inactive (logical delete)
    inquiry.isActive = false;
    inquiry.updatedBy = loggedInUserId;

    await inquiry.save();

    res.status(200).json({
      message: 'Inquiry deleted successfully (marked as inactive).',
      sucess: true,
      data: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        isActive: inquiry.isActive,
      },
    });
  } catch (error) {
    console.error({ 'Error deleting inquiry:': error, sucess: false });
    res.status(500).json({
      sucess: false,
      message: 'Failed to delete inquiry.',
      error: error.message,
    });
  }
};

export {
  addInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};
