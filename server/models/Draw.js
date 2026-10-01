const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema(
  {
    drawName: {
      type: String,
      required: [true, 'Draw name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    drawDate: {
      type: Date,
      required: [true, 'Draw date is required'],
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'archived'],
      default: 'upcoming',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Draw', drawSchema);