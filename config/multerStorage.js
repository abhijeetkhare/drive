const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // optional folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], 
  },
});

module.exports = storage;
