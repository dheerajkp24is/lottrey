const Draw = require('../models/Draw');
const WinningNumber = require('../models/WinningNumber');

// @desc    Get all draws
// @route   GET /api/draws
const getDraws = async (req, res, next) => {
  try {
    const { publishedOnly } = req.query;
    let query = {};

    if (publishedOnly === 'true') {
      query.isPublished = true;
    }

    const draws = await Draw.find(query).sort({ drawDate: -1 });
    res.status(200).json({ success: true, count: draws.length, data: draws });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single draw
// @route   GET /api/draws/:id
const getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    const prizes = await WinningNumber.find({ drawId: draw._id });

    res.status(200).json({
      success: true,
      data: {
        ...draw.toObject(),
        prizes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new draw with Mobile Number
// @route   POST /api/draws
const createDraw = async (req, res, next) => {
  try {
    const { drawName, mobile, drawDate, ticketPrice, status } = req.body;

    if (!drawName || !mobile || !drawDate) {
      return res.status(400).json({
        success: false,
        message: 'Draw name, phone number, and draw date are required',
      });
    }

    const draw = await Draw.create({
      drawName,
      mobile: mobile.toString().trim(),
      drawDate,
      ticketPrice: ticketPrice || 0,
      status: status || 'upcoming',
    });

    res.status(201).json({ success: true, data: draw });
  } catch (error) {
    next(error);
  }
};

// @desc    Update draw
// @route   PUT /api/draws/:id
const updateDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    res.status(200).json({ success: true, data: draw });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete draw
// @route   DELETE /api/draws/:id
const deleteDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    await WinningNumber.deleteMany({ drawId: draw._id });
    await draw.deleteOne();

    res.status(200).json({ success: true, message: 'Draw deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDraws,
  getDrawById,
  createDraw,
  updateDraw,
  deleteDraw,
};