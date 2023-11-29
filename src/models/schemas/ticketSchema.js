const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seatNumber: { type: Number, required: true },
  bookingTime: { type: Date, default: Date.now },
  journeyDate: { type: Date, required: true },
  status: { type: String, enum: [ 'confirmed', 'canceled'], default: 'confirmed' },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
