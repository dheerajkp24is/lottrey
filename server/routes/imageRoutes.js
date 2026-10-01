const express = require('express');
const router = express.Router();
const { getImages, addImage, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getImages)
  .post(protect, upload.single('image'), addImage);

router.route('/:id')
  .delete(protect, deleteImage);

module.exports = router;