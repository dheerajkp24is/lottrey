const mongoose = require('mongoose');

const winningNumberSchema = new mongoose.Schema(
  {
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: true,
    },
    prizeName: {
      type: String,
      required: [true, 'Prize tier name is required (e.g., 1st Prize)'],
      trim: true,
    },
    prizeAmount: {
      type: Number,
      required: [true, 'Prize amount is required'],
    },
    winningTickets: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WinningNumber', winningNumberSchema);