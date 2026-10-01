const TicketBuyer = require('../models/TicketBuyer');
const Draw = require('../models/Draw');

// @desc Get all ticket buyers (Admin)
// @route GET /api/buyers
const getBuyers = async (req, res, next) => {
  try {
    const { drawId, search } = req.query;
    let query = {};

    if (drawId) query.drawId = drawId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const buyers = await TicketBuyer.find(query)
      .populate('drawId', 'drawName drawCode drawDate')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: buyers.length, data: buyers });
  } catch (error) {
    next(error);
  }
};

// @desc Add single ticket buyer
// @route POST /api/buyers
const addBuyer = async (req, res, next) => {
  try {
    const { name, mobile, ticketNumber, drawId, notes } = req.body;

    if (!name || !mobile || !ticketNumber || !drawId) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile, ticket number and draw are required',
      });
    }

    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    const exists = await TicketBuyer.findOne({
      drawId,
      ticketNumber: ticketNumber.toString().trim().toUpperCase(),
    });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'This ticket number is already registered for this draw',
      });
    }

    const buyer = await TicketBuyer.create({
      name: name.trim(),
      mobile: mobile.toString().trim(),
      ticketNumber: ticketNumber.toString().trim().toUpperCase(),
      drawId,
      notes: notes || '',
    });

    const populated = await TicketBuyer.findById(buyer._id).populate(
      'drawId',
      'drawName drawCode drawDate'
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate ticket number for this draw',
      });
    }
    next(error);
  }
};

// @desc Bulk add ticket buyers
// @route POST /api/buyers/bulk
const bulkAddBuyers = async (req, res, next) => {
  try {
    const { drawId, buyers } = req.body;
    // buyers: [{ name, mobile, ticketNumber }]

    if (!drawId || !Array.isArray(buyers) || buyers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'drawId and buyers array are required',
      });
    }

    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    const docs = buyers
      .filter((b) => b.name && b.mobile && b.ticketNumber)
      .map((b) => ({
        name: b.name.trim(),
        mobile: b.mobile.toString().trim(),
        ticketNumber: b.ticketNumber.toString().trim().toUpperCase(),
        drawId,
      }));

    if (docs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid buyers provided' });
    }

    // insertMany with ordered:false so one duplicate doesn't stop all
    const result = await TicketBuyer.insertMany(docs, { ordered: false }).catch((err) => {
      // Partial success possible
      if (err.insertedDocs) return err.insertedDocs;
      throw err;
    });

    const inserted = Array.isArray(result) ? result : [];
    res.status(201).json({
      success: true,
      message: `${inserted.length} buyer(s) added`,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update buyer
// @route PUT /api/buyers/:id
const updateBuyer = async (req, res, next) => {
  try {
    const buyer = await TicketBuyer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('drawId', 'drawName drawCode drawDate');

    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }

    res.status(200).json({ success: true, data: buyer });
  } catch (error) {
    next(error);
  }
};

// @desc Delete buyer
// @route DELETE /api/buyers/:id
const deleteBuyer = async (req, res, next) => {
  try {
    const buyer = await TicketBuyer.findByIdAndDelete(req.params.id);
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }
    res.status(200).json({ success: true, message: 'Buyer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBuyers,
  addBuyer,
  bulkAddBuyers,
  updateBuyer,
  deleteBuyer,
};