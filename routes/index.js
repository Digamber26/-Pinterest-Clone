const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./users");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Pinterest" });
});

router.get('/login', function(req, res, next) {
  res.render("login");
});

router.get('/feed', function(req, res, next) {
  res.render("feed");
});

router.get("/profile", isLoggedIn, function(req, res, next) {
  res.render("profile");
});

router.post("/register", async function(req, res) {
  const { username, fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const user = await User.create({ username, fullname, email, password });
    req.login(user, function(err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.redirect("/profile");
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;