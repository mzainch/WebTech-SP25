const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const layout = require("express-ejs-layouts");
const fs = require("fs-extra");
const bcrypt = require("bcryptjs");

const app = express();

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
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId;
  next();
});

const USERS_FILE = "users.json";

async function loadUsers() {
  try {
    return await fs.readJSON(USERS_FILE);
  } catch {
    return [];
  }
}
async function saveUsers(users) {
  await fs.writeJSON(USERS_FILE, users, { spaces: 2 });
}

function checkAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await loadUsers();
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", { layout: false, error: "Invalid credentials" });
  }
  req.session.userId = user.id;
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const users = await loadUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.render("register", {
      layout: false,
      error: "email already taken",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), email, password: hashedPassword });
  await saveUsers(users);
  res.redirect("/login");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
