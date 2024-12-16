import Banner from '../models/banners.js';

const addBanner = async (req, res) => {
  const { title, link, payload } = req.body;
  const loggedInUserId = req.user?.id;

  const payTitle = payload.title;
  const payLink = payload.link;

  console.log(req.body, 'bod');

  console.log(title, 'title1');

  if (!loggedInUserId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  // Ensure a file is uploaded

  // Log the filename for debugging
  // console.log('Uploaded image:', req.files.images[0].filename);

  const imageFilename = req.files?.images[0]?.filename;

  try {
    // Create a new banner with the uploaded image
    const newBanner = await Banner.create({
      title: payTitle,
      image: imageFilename, // Only storing a single image filename
      link: payLink,
      createdBy: loggedInUserId,
      updatedBy: loggedInUserId,
    });

    // Return success response
    res.status(201).json({ data: newBanner });
  } catch (error) {
    console.error('Error creating banner:', error);
    res
      .status(500)
      .json({ error: 'Failed to create banner. Please try again later.' });
  }
};

const getAllBanners = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { count, rows: banners } = await Banner.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: 'Banners fetched successfully',
      data: banners,
      Pagination: {
        totalRecords: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res
      .status(500)
      .json({ error: 'Failed to retrieve banners. Please try again later.' });
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  console.log('Updating banner with ID:', id);
  const { title, link } = req.body;
  const loggedInUserId = req.user?.id;
  const imageFile = req.files?.images?.[0]?.filename;

  try {
    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    banner.title = title || banner.title;
    banner.link = link || banner.link;
    banner.image = imageFile || banner.image;
    banner.updatedBy = loggedInUserId;

    await banner.save();

    res.status(200).json({
      message: 'Banner updated successfully',
      data: {
        id: banner.id,
        title: banner.title,
        image: banner.image,
        link: banner.link,
      },
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { addBanner, getAllBanners, updateBanner };
