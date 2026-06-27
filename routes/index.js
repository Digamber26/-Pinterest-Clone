const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./users");
const Post = require("./posts");
const upload = require("./multer");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Pinterest" });
});

router.get('/login', function(req, res, next) {
  const errors = req.flash('error');
  res.render("login", { error: errors.length > 0 ? errors[0] : '' });
});

router.get('/feed', function(req, res, next) {
  res.render("feed");
});

router.post('/upload', isLoggedIn, function(req, res, next) {
  console.log('📨 Upload request received');
  upload.single('file')(req, res, async function(err) {
    if (err) {
      console.error('❌ Upload error:', err.message);
      return res.status(400).send('Upload error: ' + err.message);
    }
    
    if (!req.file) {
      console.log('⚠️  No file in request');
      return res.status(400).send('No file uploaded.');
    }
    
    console.log('✓ File received by multer:');
    console.log('  - Filename:', req.file.filename);
    console.log('  - Size:', req.file.size);
    console.log('  - Path:', req.file.path);
    
    try {
      // Create a new post
      const post = await Post.create({
        image: req.file.filename,
        imageText: req.body.filecaption || 'No caption',
        user: req.user._id
      });
      console.log('✓ Post created:', post._id);
      
      // Add post to user's posts array
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { posts: post._id } },
        { new: true }
      );
      console.log('✓ Post added to user');
      res.redirect('/profile');
    } catch (err) {
      console.error('❌ Database error:', err.message);
      res.status(500).send(err.message);
    }
  });
});

 
router.get("/profile", isLoggedIn, async function(req, res, next) {
  try {
    console.log('📄 Loading profile for user:', req.user._id);
    const user = await User.findById(req.user._id).populate("posts");
    if (!user) {
      console.log('⚠️  User not found');
      return res.status(404).send('User not found');
    }
    console.log('✓ User found:', user.username);
    res.render("profile", { user });
  } catch (err) {
    console.error('❌ Profile error:', err.message);
    console.error('   Stack:', err.stack);
    res.status(500).send('Error loading profile: ' + err.message);
  }
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

router.post("/login",passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
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