const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");


router.get("/cart", isAuthenticated, (req, res) => {
  res.render("cart", { cart: req.session.cart || [] });
});

router.post("/add-to-cart/:slug", async (req, res) => {
  const products = await fs.readJSON(path.join(__dirname, "../products.json"));
  const product = products.find((p) => p.slug === req.params.slug);

  if (!product) return res.status(404).send("Product not found");

  req.session.cart = req.session.cart || [];
  req.session.cart.push(product);
  req.flash("success", "Product added to cart!");

  // Redirect back to the page the request came from
  res.redirect(req.get("referer"));
});

router.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cart });
});

router.post("/remove-from-cart/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (
    !isNaN(index) &&
    Array.isArray(req.session.cart) &&
    index >= 0 &&
    index < req.session.cart.length
  ) {
    req.session.cart.splice(index, 1);
  }

  res.redirect("/cart");
});

router.post("/checkout", (req, res) => {
  // Placeholder logic
  req.session.cart = []; // Clear cart after checkout
  res.send("Order placed successfully!");
});

module.exports = router;
