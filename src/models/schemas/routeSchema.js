const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
  eta: { type: String, required: true },
  buses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }],
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
