const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seatNumber: { type: Number, required: true },
//   Time of booking / date of jounery / status
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
