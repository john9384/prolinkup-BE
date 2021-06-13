const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require("http-status-codes");

// Load in the Error Responses
const {
  SuccessResponse,
  FailResponse
} = require("../../library/helpers/responseHelpers");

// Load the post Service
const postService = require("./post.service");
const profileService = require("../profiles/profile.service");
const userService = require("../users/users.service");
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");

/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.getPosts = async (req, res) => {
  try {
    const posts = await postService.findPost();
    return res.json(
      new SuccessResponse.Builder()
        .withContent(posts)
        .withMessage("Posts Loaded")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};
exports.getPostById = async (req, res) => {
  try {
    const post = await postService.findPost(req.params.id);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(post)
        .withMessage("Posts Loaded")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};

exports.postPosts = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await profileService.findOneProfile({ user: user.id });
    if (profile == null) {
      throw new Error("No Profile Create profile to post");
    } else {
      const createdPost = {
        text: req.body.text,
        name: req.body.name,
        handle: profile.handle,
        avatar: req.body.avatar,
        user: user.id
      };
      await postService.savePost(createdPost);
      const posts = await postService.findPost();
      return res.json(
        new SuccessResponse.Builder()
          .withContent(posts)
          .withMessage("Post posted")
          .build()
      );
    }
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};
/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.deletePostsById = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const currentPost = await postService.findPost(req.params.id);
    // Check for post owner
    if (currentPost.user.toString() !== user.id) {
      return res.status(401).json({ notauthorized: "User not authorized" });
    }
    // Delete
    await postService.deletePost(currentPost);
    const allPosts = await postService.findPost();
    return res.json(
      new SuccessResponse.Builder()
        .withContent(allPosts)
        .withMessage("Posts deleted")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};

/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.postLikes = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const postId = await postService.findPost(req.params.id);
    const post = await postService.saveLikes(postId, user);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(post)
        .withMessage("Post liked")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};

/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.postUnlike = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const postId = await postService.findPost(req.params.id);
    const post = await postService.saveUnlike(postId, user);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(post)
        .withMessage("Post liked")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};

/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.postComment = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await profileService.findOneProfile({ user: user._id });
    const newComment = {
      text: req.body.text,
      name: profile.username,
      handle: profile.handle,
      avatar: profile.avatar,
      user: user.id
    };

    const comment_post = await postService.saveComment(
      req.params.id,
      newComment
    );
    return res.json(
      new SuccessResponse.Builder()
        .withContent(comment_post)
        .withMessage("Comment added")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};
/**
  @param {String} path Profile load path
  @return {Post} Profile instance
  @api private
 */
exports.removeComment = async (req, res) => {
  try {
    const postId = await postService.findPost(req.params.id);
    const comment = postService.removeComment(postId, req.params.comment_id);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(comment)
        .withMessage("Comment removed")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err.name)
          .withMessage(err.message)
          .build()
      );
  }
};
