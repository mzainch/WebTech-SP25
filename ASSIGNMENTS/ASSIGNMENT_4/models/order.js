const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [Object],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
