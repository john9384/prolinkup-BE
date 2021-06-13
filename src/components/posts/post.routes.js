const express = require("express");
const router = express.Router();

const { catchErrors } = require("../../library/helpers/errorHandlers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");

// Load the post service
const postController = require("./post.controller");
// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET /posts
// @desc    Get posts
// @access  Public
router.get("/", catchErrors(postController.getPosts));

// @route   GET /posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", catchErrors(postController.getPostById));

// @route POST /posts
// @desc  save post
// @access private
router.post("/", getAuthorize, catchErrors(postController.postPosts));

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  getAuthorize,
  catchErrors(postController.deletePostsById)
);
router.post("/like/:id", getAuthorize, catchErrors(postController.postLikes));

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  getAuthorize,
  catchErrors(postController.postUnlike)
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  getAuthorize,
  catchErrors(postController.postComment)
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  getAuthorize,
  catchErrors(postController.removeComment)
);
module.exports = router;
