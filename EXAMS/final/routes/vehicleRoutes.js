const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicleModel");
const multer = require("multer");
const path = require("path");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/vehicles"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Public view - list all vehicles
router.get("/vehicles", async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.render("vehicles/index", { vehicles });
});

// Admin panel - list vehicles
router.get("/admin/vehicles", isAuthenticated, isAdmin, async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.render("vehicles/adminList", { vehicles });
});

// New vehicle form
router.get("/admin/vehicles/new", isAuthenticated, isAdmin, (req, res) => {
  res.render("vehicles/new");
});

// Create new vehicle
router.post(
  "/admin/vehicles",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { name, brand, price, type } = req.body;
    const image = "/uploads/vehicles/" + req.file.filename;
    await Vehicle.create({ name, brand, price, type, image });
    res.redirect("/admin/vehicles");
  }
);

// Edit vehicle form
router.get(
  "/admin/vehicles/:id/edit",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    res.render("vehicles/edit", { vehicle });
  }
);

// Update vehicle
router.post(
  "/admin/vehicles/:id",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { name, brand, price, type } = req.body;
    const updateData = { name, brand, price, type };
    if (req.file) {
      updateData.image = "/uploads/vehicles/" + req.file.filename;
    }
    await Vehicle.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/vehicles");
  }
);

// Delete vehicle
router.post(
  "/admin/vehicles/:id/delete",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.redirect("/admin/vehicles");
  }
);

module.exports = router;
