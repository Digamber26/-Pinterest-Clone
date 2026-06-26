const express = require("express");
const router = express.Router();

const usermodel = require("./users");
const postmodel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.authenticate(new localStrategy(usermodel.authenticate()));

router.get("/", function(req, res, next){
  res.render("index",{title: "Pinterest"});
});

router.get("/profile", isLoggedIn,function(req, res, next) {
  res.send("profile page");
});

router.post("/register",function (req, res) {
  const { username, fullname, email } = req.body;
const userData = new usermodel({ username, fullname, email });

userModel.register(userData, req.body.password)
.then(function () {
  pasdsport.authenticate("local")(req, res, function () {
    res.redirect("/profile");
  })
})
})

router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/",
}),function (req, res) {

});

router.get("/logout", function (req, res) {



})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;