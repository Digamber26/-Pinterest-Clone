var express = require('express');
var router = express.Router();

const usermodel = require("./users");
const postmodel = require("./posts");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET create user form. */
router.get('/createuser', function(req, res, next) {
  res.render('createuser');
});

/* POST create user. */
router.post('/createuser', async function(req, res, next) {
  try {
    const createdUser = await usermodel.create({
      username: "Digamber Kalambe",
      fullname: "Digamber Kalambe",
      email: "digamber@example.com",
      password: "password123",
      post: []
    });
    res.send(createdUser);
  } catch (error) {
    next(error);
  }
});

/* GET create post. */
router.get("/createpost", async function (req, res) {
  try {
    const post = await postmodel.create({
      postText: "My first Pinterest post",
      likes: 0,
    });

    res.send(post);
  } catch (err) {
    console.log("Create post error:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
