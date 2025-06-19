function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();

  req.flash("error", "Please log in to access this page.");
  res.redirect("/login");
}

module.exports = isAuthenticated;
