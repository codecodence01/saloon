const multer = require('multer');
const path = require('path');

/**
 * Multer configuration for local or Cloudinary uploads.
 * When Cloudinary credentials are present, use CloudinaryStorage;
 * otherwise fall back to memory storage for local testing.
 */

let storage;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  // Cloudinary storage
  const cloudinary = require('../config/cloudinary');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'glamour-salon',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
} else {
  // Memory storage (for local dev without Cloudinary)
  storage = multer.memoryStorage();
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = upload;
