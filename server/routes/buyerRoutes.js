const express = require('express');
const router = express.Router();
const {
  getBuyers,
  addBuyer,
  bulkAddBuyers,
  updateBuyer,
  deleteBuyer,
} = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBuyers)
  .post(protect, addBuyer);

router.post('/bulk', protect, bulkAddBuyers);

router.route('/:id')
  .put(protect, updateBuyer)
  .delete(protect, deleteBuyer);

module.exports = router;