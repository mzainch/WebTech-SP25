const Order = require("../models/order");

router.post("/checkout", isAuthenticated, async (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  await Order.create({
    email: req.session.email,
    items: cart,
    totalPrice: total,
  });

  req.session.cart = [];
  req.flash("success", "Order placed successfully!");
  res.redirect("/my-orders");
});
