const { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = require("http-status-codes");

const userService = require("./users.service");

const {
  SuccessResponse,
  FailResponse,
} = require("../../library/helpers/responseHelpers");
const { sentenceCase } = require("../../library/helpers/stringHelpers");
const validator = require("../../library/helpers/validatorHelper");

exports.test = (req, res) => {
  return res.status(200).send({ msg: "User Route working" });
};
exports.postSignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const error = await validator.validateUserSignUp(req.body);
    if (error.state !== false) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          new FailResponse.Builder()
            .withContent(error)
            .withMessage("Form Validation Error")
            .build()
        );
    }

    let formattedFirstName = sentenceCase(firstname);
    let formattedLastName = sentenceCase(lastname);
    const user = await userService.signUp(
      formattedFirstName,
      formattedLastName,
      phone,
      email,
      password,
      req.headers.host
    );

    return res
      .status(OK)
      .json(
        new SuccessResponse.Builder()
          .withContent(user)
          .withMessage("User account created successfully")
          .build()
      );
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(
        new FailResponse.Builder()
          .withContent(error.name)
          .withMessage(error.message)
          .build()
      );
  }
};
exports.postAuthenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const error = await validator.validateUserLogin(req.body);
    if (error.state == true) {
      return res
        .status(NOT_FOUND)
        .json(
          new FailResponse.Builder()
            .withContent(error)
            .withMessage("Form Validation Error")
            .build()
        );
    }

    let token = await userService.authenticate(email, password);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(token)
        .withMessage("User successfully logged In")
        .build()
    );
  } catch (err) {
    return res
      .status(NOT_FOUND)
      .json(
        new FailResponse.Builder()
          .withContent(err)
          .withMessage(err.message)
          .build()
      );
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();

    return res.json(
      new SuccessResponse.Builder()
        .withContent(users)
        .withMessage("All users successfully loaded")
        .build()
    );
  } catch (error) {
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

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage("Current user successfully loaded")
        .build()
    );
  } catch (error) {
    return res
      .status(400)
      .send(
        new FailResponse.Builder()
          .withContent(error.name)
          .withMessage(error.message)
          .build()
      );
  }
};

exports.getConfirmSignUp = async (req, res) => {
  try {
    // Get the token from the query in the confirmation url
    const token = req.query.token;
    //Call the confirm signup service
    const user = await userService.confirmSignUp(token);

    return res.status(ACCEPTED).send(
      sendResponse({
        message: "User's signup successfully activated",
        content: user,
        success: true,
      })
    );
  } catch (err) {
    Logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        message: err.message,
        content: err,
        success: false,
      })
    );
  }
};
exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the input
    const isNotValid = await validate.validateUserForgotPassword(email);
    if (isNotValid.state) {
      Logger.error(isNotValid);
      throw new CustomError(isNotValid);
    }

    // Call the forgot password servicice
    await userService.forgotPassword(email, req.headers.host);

    return res.status(OK).send(
      sendResponse({
        message: "You have been emailed a password reset link.",
        content: {},
        success: true,
      })
    );
  } catch (err) {
    Logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        message: err.message,
        content: err,
        success: false,
      })
    );
  }
};

exports.getConfirmResetPassword = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await userService.confirmResetPassword(token);

    return res.status(ACCEPTED).send(
      sendResponse({
        message: `Your password is: ${user.resetPassword}`,
        content: user,
        success: true,
      })
    );
  } catch (err) {
    Logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        message: err.message,
        content: err,
        success: false,
      })
    );
  }
};

exports.postChangePassword = async (req, res) => {
  try {
    // Get Input from the forms, "confirm" input is used in validation
    const { current, password } = req.body;

    // Validate input
    const isNotValid = await validate.validateUserChangePassword(req.body);
    if (isNotValid.state) {
      Logger.error(isNotValid);
      throw new CustomError(isNotValid);
    }

    // Calling the update password service
    const updatedUser = await userService.updatePassword(
      req.decoded.email,
      current,
      password
    );
    return res.status(OK).send(
      sendResponse({
        message: "Your password has been changed",
        content: updatedUser,
        success: true,
      })
    );
  } catch (err) {
    Logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send(
      sendResponse({
        message: err.message,
        content: err,
        success: false,
      })
    );
  }
};
exports.deleteUserAcct = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await userService.deleteAcct({ _id: user.id });
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Account Deleted Successfully")
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
