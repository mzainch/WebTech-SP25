// app.js
const express = require("express");
const session = require("express-session");
const path = require("path");
const layout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const User = require("./models/userModel");
const productRoutes = require("./routes/productRoutes");
const shopRoutes = require("./routes/shopRoutes");
const cartRoutes = require("./routes/cartRoutes");
const flash = require("connect-flash");
const orderRoutes = require('./routes/orderRoutes');


const app = express();

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(layout);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.locals.cart = req.session.cart;

  if (req.session.userId) {
    res.locals.isAuthenticated = true;
    res.locals.currentUser = await User.findById(req.session.userId).catch(
      () => null
    );
  } else {
    res.locals.isAuthenticated = false;
    res.locals.currentUser = null;
  }
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", shopRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
