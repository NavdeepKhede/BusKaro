const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
});


const User = mongoose.model("User", userSchema);

module.exports = User;
