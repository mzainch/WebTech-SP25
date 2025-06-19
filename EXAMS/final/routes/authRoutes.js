const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash("error", "Invalid login credentials");
    return res.redirect("/login");
  }

  req.session.userId = user._id;
  req.session.user = {
    email: user.email,
    role: user.role, //
  };

  res.redirect("/");
});

router.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    req.flash("error", "Email already taken");
    return res.render("register", {
      layout: false,
      error: "Email already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  req.flash("success", "Successfully registered!");
  res.render("login", {
    layout: false,
    success: "Successfully registered!",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
