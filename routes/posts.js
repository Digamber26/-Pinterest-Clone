const mongoose = require("mongoose");

// Define the post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  likes: {
    type: Array,
    default: [],
  },
});

// Create the post model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;