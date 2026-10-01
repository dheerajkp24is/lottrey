const WinnerImage = require('../models/WinnerImage');
const path = require('path');
const fs = require('fs');

// @desc Get all winner images
const getImages = async (req, res, next) => {
  try {
    const images = await WinnerImage.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc Add new winner image via File Upload
const addImage = async (req, res, next) => {
  try {
    const { label, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    if (!label) {
      return res.status(400).json({ success: false, message: 'Label is required' });
    }

    // Construct accessible image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const image = await WinnerImage.create({
      imageUrl,
      label,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc Delete image & file from server
const deleteImage = async (req, res, next) => {
  try {
    const image = await WinnerImage.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    // Try deleting file from disk if local
    if (image.imageUrl.includes('/uploads/')) {
      const filename = image.imageUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await image.deleteOne();
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getImages, addImage, deleteImage };