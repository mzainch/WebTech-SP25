const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("index", { title: "Home", products });
});

module.exports = router;
