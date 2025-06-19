const express = require("express");
const Product = require("../models/productModel");
const fs = require("fs-extra");
const path = require("path");
const router = express.Router();

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

router.get("/cart", isAuthenticated, (req, res) => {
  res.render("cart", { cart: req.session.cart || [] });
});

router.get("/products/:slug", async (req, res) => {
  const slug = req.params.slug;
  console.log("Requested slug:", slug); // 🧪 Debug log

  const products = await fs.readJSON(path.join(__dirname, "../products.json"));
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    console.log("Product not found!");
    return res.status(404).send("Product not found");
  }

  console.log("Product found:", product.title);
  res.render("product", { product });
});

module.exports = router;
