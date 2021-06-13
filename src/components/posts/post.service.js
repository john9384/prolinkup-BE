const logger = require("../../library/helpers/loggerHelpers");
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("./post.model");

exports.findPost = async query => {
  if (query == null || query == "undefined") {
    const posts = await Post.find().sort({ date: -1 });
    return posts;
  } else if (query !== Object) {
    const posts = await Post.findById(query);
    return posts;
  } else if (query) {
    const posts = await Post.find(query);
    return posts;
  } else {
    return "No Post Added yet";
  }
};
exports.savePost = async createdPost => {
  const newPost = new Post(createdPost);
  await newPost.save();
};
exports.deletePost = async post => {
  post.remove();
};
exports.saveLikes = async (post, user) => {
  if (post.likes.filter(like => like.user.toString() === user.id).length > 0) {
    logger.warn("Already Liked");
    throw new Error("Already Liked");
  }
  // Add user id to likes array
  post.likes.unshift({ user: user.id });

  post.save();
  return post;
};
exports.saveUnlike = async (post, user) => {
  // Get remove index
  const removeIndex = post.likes
    .map(item => item.user.toString())
    .indexOf(user.id);

  // Splice out of array
  post.likes.splice(removeIndex, 1);

  // Save
  post.save();
  return post;
};
exports.saveComment = async (query, newComment) => {
  const post = await Post.findById(query);
  // Add to comments array
  post.comments.unshift(newComment);

  // Save
  post.save();
  return post;
};
exports.removeComment = async (post, reqParams) => {
  // Check to see if comment exists
  if (
    post.comments.filter(comment => comment._id.toString() === reqParams)
      .length === 0
  ) {
    return res.status(404).json({
      commentnotexists: "Comment does not exist"
    });
  }

  // Get remove index
  const removeIndex = post.comments
    .map(item => item._id.toString())
    .indexOf(reqParams);

  // Splice comment out of array
  post.comments.splice(removeIndex, 1);

  post.save();
  return post;
};
