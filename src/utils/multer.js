import multer from 'multer';
import path from 'path';

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve('./uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer file filter to allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file size limit
});

// Route handler to handle multiple file uploads (images and videos)
const uploadFiles = upload.fields([
  { name: 'Category_Banner' },
  { name: 'SubCategory_banner' }, // Name in the form for image files
  { name: 'images' }, // Name in the form for image files
  { name: 'videos' }, // Name in the form for video files
]);

export { uploadFiles };
