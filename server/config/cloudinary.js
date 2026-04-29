const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary SDK from environment variables.
 * Only configured when credentials are present.
 */
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary credentials missing — image uploads disabled');
}

module.exports = cloudinary;
