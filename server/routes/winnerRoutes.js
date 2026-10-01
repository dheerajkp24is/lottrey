const express = require('express');
const router = express.Router();
const { setWinningNumbers, getWinningNumbers } = require('../controllers/winnerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:drawId')
  .get(getWinningNumbers)
  .post(protect, setWinningNumbers);

module.exports = router;