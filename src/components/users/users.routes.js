const express = require("express");
const router = express.Router();

const { catchErrors } = require("../../library/helpers/errorHandlers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");
const userController = require("./users.controller");

/**
 * Get all Users
 * @name   get/
 * @route  GET /user
 * @api    public
 * @desc   route to get all users
 * @param  {String} path users profiles path
 * @return {Object} Users Instance
 */
router.get("/", catchErrors(userController.test));

/**
 * User login
 * @name   post/login
 * @route  POST /user/login
 * @api    public
 * @desc   route to login users
 * @param  {String} path user login path
 * @return {Object} Users Instance
 */
router.post("/authenticate", catchErrors(userController.postAuthenticate));

/**
 * User Signup
 * @name   post/signup
 * @route  GET /user/sign-up
 * @desc   Local user signup flow
 * @api    public
 * @params {String} path user's signup path
 * @path    "user/sign-up"
 * @return {Users} `User` instance
 */
router.post("/sign-up", catchErrors(userController.postSignUp));
/**
 * User Signup Confirmation
 * @name   get/confirm-sign-up
 * @route  GET api/v1/user/confirm-sign-up
 * @api    public
 * @desc   route for user to confirm signup
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get("/confirm-sign-up", catchErrors(userController.getConfirmSignUp));

/**
 * User forgot password
 * @name   post/forgot-password
 * @route  POST /user/forgot-password
 * @api    public
 * @desc   route for user to get password reset
 * @param  {String} path user's signup path
 * @return {Object} Response object with empty content and success message
 */
router.post("/forgot-password", catchErrors(userController.postForgotPassword));

/**
 * User confirm reset password
 * @name   get/confirm-reset-password
 * @route  POST /user/confirm-reset-password
 * @api    public
 * @desc   route for user to get confirm their password reset
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get(
  "/confirm-reset-password",
  catchErrors(userController.getConfirmResetPassword)
);
router.get("/all", catchErrors(userController.getUsers));
// Protected routes
router.get(
  "/get-current",
  getAuthorize,
  catchErrors(userController.getCurrentUser)
);
// router.get("/confirm-sign-up", catchErrors(userController.getConfirmSignUp));
// router.post("/forgot-password", catchErrors(userController.postForgotPassword));
// router.get(
//   "/confirm-reset-password",
//   catchErrors(userController.getConfirmResetPassword)
// );

// router.post(
//   "/change-password",
//   getAuthorize,
//   catchErrors(userController.postChangePassword)
// );
router.delete("/", getAuthorize, catchErrors(userController.deleteUserAcct));

module.exports = router;
