const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register initial Admin (can disable in production)
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = await Admin.create({ username, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide credentials' });
    }

    const admin = await Admin.findOne({
      $or: [{ email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail }],
    });

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username/email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/auth/me
// @access  Private (Admin only)
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
};

module.exports = { registerAdmin, loginAdmin, getMe };