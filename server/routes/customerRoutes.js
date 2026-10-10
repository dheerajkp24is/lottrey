const express = require('express');
const router = express.Router();
const {
  checkMobile,
  registerCustomer,
  getProfileByMobile,
  getAllCustomers,
  deleteCustomer,
  markChecked,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/check/:mobile', checkMobile);
router.post('/register', registerCustomer);
router.get('/profile/:mobile', getProfileByMobile);
router.put('/:mobile/checked', markChecked);

// Admin only
router.get('/', protect, getAllCustomers);
router.delete('/:id', protect, deleteCustomer);

module.exports = router;