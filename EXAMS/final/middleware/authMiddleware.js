function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();

  req.flash("error", "Please log in to access this page.");
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }

  req.flash("error", "Admin access only.");
  res.redirect("/");
}

module.exports = {
  isAuthenticated,
  isAdmin,
};
