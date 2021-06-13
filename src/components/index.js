//Loading the user components
const userRoutes = require("./users/users.routes");
const userModel = require("./users/users.model");
const userService = require("./users/users.service");
//Loading the profile components
const profileRoutes = require("./profiles/profile.routes");
const profileModel = require("./profiles/profile.model");
const profileService = require("./profiles/profile.service");
//Loading the post components
const postRoutes = require("./posts/post.routes");
const postModel = require("./posts/post.model");
const postService = require("./posts/post.service");

const componentModule = {
  user: {
    routes: userRoutes,
    model: userModel,
    service: userService,
  },
  profile: {
    routes: profileRoutes,
    model: profileModel,
    service: profileService,
  },
  post: {
    routes: postRoutes,
    model: postModel,
    service: postService,
  },
};

module.exports = componentModule;
