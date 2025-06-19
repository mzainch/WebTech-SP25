const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const Order = require("../models/order");

router.post("/checkout", isAuthenticated, async (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      req.flash("error", "Cart is empty");
      return res.redirect("/shop");
    }

    const order = new Order({
      email: req.session.email, // assuming you store email in session
      items: req.session.cart,
      createdAt: new Date(),
    });

    await order.save();

    req.session.cart = []; // clear cart after order
    req.flash("success", "Order placed successfully!");
    res.redirect("/my-orders");
  } catch (err) {
    console.error("Checkout error:", err);
    req.flash("error", "Order failed. Try again.");
    res.redirect("/shop");
  }
});
module.exports = router;
