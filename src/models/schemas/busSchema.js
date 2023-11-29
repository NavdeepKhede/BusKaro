const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableDays: { type: [String], required: true },
  arrival: { type: String, required: true },
  departure: { type: String, required: true },
  occupiedSeats: {
    type: Map,
    of: [Number], default: {}
  },
  routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus; 