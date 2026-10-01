const mongoose = require('mongoose');

const ticketBuyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
      trim: true,
      uppercase: true,
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: [true, 'Draw is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// One mobile can have multiple tickets, but same ticket shouldn't repeat in same draw
ticketBuyerSchema.index({ drawId: 1, ticketNumber: 1 }, { unique: true });

module.exports = mongoose.model('TicketBuyer', ticketBuyerSchema);