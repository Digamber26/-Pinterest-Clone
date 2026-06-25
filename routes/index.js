const express = require("express");
const router = express.Router();

const usermodel = require("./users");
const postmodel = require("./posts");

/* GET create user */
router.get("/createuser", async function (req, res, next) {
  try {
    const createdUser = await usermodel.create({
      username: "digamber",
      fullname: "Digamber Kalambe",
      email: "digamber@example.com",
      password: "password123",
      posts: [],
    });

    res.send(createdUser);
  } catch (err) {
    next(err);
  }
});

/* GET create post */
router.get("/createpost", async function (req, res, next) {
  try {
    // Find the user first
    const user = await usermodel.findOne({
      email: "digamber@example.com",
    });

    // If user is not found, send 400 error
    if (!user) {
      return res.status(400).send("User not found. Open /createuser first.");
    }

    // Create post with correct user ID
    const post = await postmodel.create({
      postText: "My first Pinterest post",
      user: user._id,
      likes: [],
    });

    // Add post ID into user's posts array
    user.posts.push(post._id);
    await user.save();

    res.send(post);
  } catch (err) {
    console.log("Create post error:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;