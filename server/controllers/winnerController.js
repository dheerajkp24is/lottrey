const WinningNumber = require('../models/WinningNumber');
const Draw = require('../models/Draw');

// @desc    Set/Update winning numbers for a draw
// @route   POST /api/winners/:drawId
// @access  Private (Admin)
const setWinningNumbers = async (req, res, next) => {
  try {
    const { drawId } = req.params;
    const { prizes, publishNow } = req.body; // Array of { prizeName, prizeAmount, winningTickets: [] }

    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    // Remove old prizes if re-setting
    await WinningNumber.deleteMany({ drawId });

    // Format and insert
    const prizeRecords = prizes.map((p) => ({
      drawId,
      prizeName: p.prizeName,
      prizeAmount: p.prizeAmount,
      winningTickets: p.winningTickets.map((t) => t.toString().trim().toUpperCase()),
    }));

    const createdPrizes = await WinningNumber.insertMany(prizeRecords);

    // Update draw status and publishing
    draw.status = 'completed';
    if (publishNow !== undefined) {
      draw.isPublished = publishNow;
    }
    await draw.save();

    res.status(200).json({
      success: true,
      message: 'Winning numbers updated successfully',
      data: createdPrizes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get winning numbers for a draw
// @route   GET /api/winners/:drawId
// @access  Public
const getWinningNumbers = async (req, res, next) => {
  try {
    const { drawId } = req.params;
    const prizes = await WinningNumber.find({ drawId });

    res.status(200).json({ success: true, count: prizes.length, data: prizes });
  } catch (error) {
    next(error);
  }
};

module.exports = { setWinningNumbers, getWinningNumbers };