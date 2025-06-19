const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

const isAuthenticated = require("../middleware/authMiddleware");

router.get("/cart", isAuthenticated, (req, res) => {
  res.render("cart", { cart: req.session.cart || [] });
});

router.get("/shop", isAuthenticated, async (req, res) => {
  const products = await fs.readJSON(path.join(__dirname, "../products.json"));
  res.render("shop", { products });
});

router.get("/products/:slug", async (req, res) => {
  const products = await fs.readJSON(path.join(__dirname, "../products.json"));
  console.log("🧭 Requested slug:", req.params.slug);
  const product = products.find((p) => p.slug === req.params.slug);

  if (!product) return res.status(404).send("Product not found");

  res.render("product", { product });
});

module.exports = router;
