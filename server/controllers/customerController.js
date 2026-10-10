const Customer = require('../models/Customer');

// @desc Check if mobile already registered
// @route GET /api/customers/check/:mobile
const checkMobile = async (req, res, next) => {
  try {
    const mobile = req.params.mobile.toString().trim();
    const customer = await Customer.findOne({ mobile });

    if (customer) {
      return res.status(200).json({
        success: true,
        exists: true,
        data: customer,
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: 'Mobile not registered. Please complete registration first.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register new customer (bio data)
// @route POST /api/customers/register
const registerCustomer = async (req, res, next) => {
  try {
    const { name, mobile, email, age, gender, address, city, state, pincode } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Name and mobile number are required',
      });
    }

    const cleanMobile = mobile.toString().trim();

    const exists = await Customer.findOne({ mobile: cleanMobile });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already registered',
        data: exists,
      });
    }

    const customer = await Customer.create({
      name: name.trim(),
      mobile: cleanMobile,
      email: email || '',
      age: age || null,
      gender: gender || '',
      address: address || '',
      city: city || '',
      state: state || 'Kerala',
      pincode: pincode || '',
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: customer,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number already registered',
      });
    }
    next(error);
  }
};

// @desc Get customer profile by mobile
// @route GET /api/customers/profile/:mobile
const getProfileByMobile = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ mobile: req.params.mobile.trim() });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc Get all customers (Admin)
// @route GET /api/customers
const getAllCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete customer (Admin)
// @route DELETE /api/customers/:id
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc Update last checked time
// @route PUT /api/customers/:mobile/checked
const markChecked = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { mobile: req.params.mobile.trim() },
      { lastCheckedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkMobile,
  registerCustomer,
  getProfileByMobile,
  getAllCustomers,
  deleteCustomer,
  markChecked,
};