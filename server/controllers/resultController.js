const Draw = require('../models/Draw');
const WinningNumber = require('../models/WinningNumber');

// @desc    Check result by phone number
// @route   POST /api/check
const checkResult = async (req, res, next) => {
  try {
    const { drawId, ticketNumber, mobile } = req.body;
    const inputMobile = (mobile || ticketNumber || '').toString().trim();

    if (!inputMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your mobile number',
      });
    }

    // 1. Find draw by ID or search by phone number directly
    let draw = null;
    if (drawId) {
      draw = await Draw.findById(drawId);
    } else {
      // Find draw matching the entered phone number
      draw = await Draw.findOne({ mobile: inputMobile, isPublished: true });
      if (!draw) {
        // Fallback to latest published draw
        draw = await Draw.findOne({ isPublished: true }).sort({ drawDate: -1 });
      }
    }

    if (!draw) {
      return res.status(404).json({
        success: false,
        message: 'No published draw found for this number',
      });
    }

    if (!draw.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Results for this draw have not been announced yet',
      });
    }

    // 2. Check winning numbers for this draw
    const prizes = await WinningNumber.find({ drawId: draw._id });
    let wonPrize = null;

    for (const prize of prizes) {
      // Check if user's phone number or ticket is in winning list
      if (
        prize.winningTickets.includes(inputMobile) ||
        draw.mobile === inputMobile
      ) {
        wonPrize = prize;
        break;
      }
    }

    if (wonPrize) {
      return res.status(200).json({
        success: true,
        isWinner: true,
        data: {
          drawName: draw.drawName,
          mobile: draw.mobile,
          drawDate: draw.drawDate,
          prizeName: wonPrize.prizeName,
          prizeAmount: wonPrize.prizeAmount,
        },
      });
    }

    // Not a winner
    return res.status(200).json({
      success: true,
      isWinner: false,
      data: {
        drawName: draw.drawName,
        mobile: inputMobile,
        drawDate: draw.drawDate,
      },
      message: 'Better luck next time! No winning prize found for this mobile number.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkResult };