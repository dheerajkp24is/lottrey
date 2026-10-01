const express = require('express');
const router = express.Router();
const {
  getDraws,
  getDrawById,
  createDraw,
  updateDraw,
  deleteDraw,
} = require('../controllers/drawController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDraws)
  .post(protect, createDraw);

router.route('/:id')
  .get(getDrawById)
  .put(protect, updateDraw)
  .delete(protect, deleteDraw);

module.exports = router;