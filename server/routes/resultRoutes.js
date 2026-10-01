const express = require('express');
const router = express.Router();
const { checkResult } = require('../controllers/resultController');

router.post('/', checkResult);

module.exports = router;