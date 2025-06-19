const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const router = express.Router();
const usersFile = "./users.json";

// Load existing users
function loadUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => u.username === username)) {
    return res.send("User already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  saveUsers(users);

  res.redirect("/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.send("Invalid credentials");
  }

  req.session.user = user;
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
