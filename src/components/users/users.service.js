const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const User = require("./users.model");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const config = require("../../config/");
const { randomPassword } = require("../../library/helpers/stringHelpers");
//const mailHelpers = require("../../library/helpers/mailHelpers");
const CustomError = require("../../library/middlewares/customError");
exports.signUp = async (firstname, lastname, phone, email, password) => {
  let avatar = await gravatar.url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm", // Default
  });
  // Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User Exists");
  } else {
    // Save the user
    const user = new User({
      firstname,
      lastname,
      phone,
      email,
      password,
      avatar,
    });
    await user.save();

    // Send them an email with the token
    // const tokenConfirm = jwtHelpers.encode({ email }, config.jwtSecret, {
    //   expiresIn: "15d"
    // });
    // const resetURL = `http://${host}/api/v1/confirm-sign-up?token=${tokenConfirm}`;
    // await mailHelpers.send({
    //   user,
    //   filename: "confirm-sign-up",
    //   subject: "Confirm Sign Up",
    //   resetURL
    // });

    return user;
  }
};

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("Authentication failed. Email not registered.");
    let error = {
      field: "email",
      detail: "Email does not exist",
    };
    throw new CustomError(error);
  }

  const isValidPassword = await bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    logger.warn("Authentication failed. Wrong password.");
    let error = {
      field: "password",
      detail: "Incorrect password",
    };
    throw new CustomError(error);
  }
  const payload = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    avatar: user.avatar,
    phone: user.phone,
    enable: user.enable,
  };
  let token = jwtHelpers.encode(payload, config.jwtSecret, {
    expiresIn: "24h",
  });
  logger.info(`Auth token created: ${token}`);

  return { token: `${config.tokenType} ${token}` };
};

exports.confirmSignUp = async (token) => {
  // Validate token
  if (!token) {
    throw new Error("Token Not Found");
  }
  // Decode User email from token
  let decoded = await jwtHelpers.decode(token, config.jwtSecret);
  let email = decoded.email;
  // Enable user

  // Check if user is Enabled
  let user = await User.findOne({ email });
  if (user.isEnabled === true) {
    Logger.warn("User already confirmed");
    throw new Error("User already confirmed");
  }
  // Set isEnable to true and update
  user.isEnabled = true;
  await User.updateOne({ email }, user);

  // Return user
  return user;
};

exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw new Error("Authentication failed. User not found.");
  }

  return user;
};

exports.findCurrentUser = async (token) => {
  // Decode token
  try {
    let decoded = await jwtHelpers.decode(token, config.jwtSecret);
    let email = decoded.payload.email;
    // Find user
    let user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.findAllUsers = async () => {
  const users = await User.find();

  if (!users) {
    logger.warn("No User found.");
    let error = new Error("No User found.");
    console.log(error);
  }

  return users;
};

exports.forgotPassword = async (email, host) => {
  // Check if email supplied exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account with that email exists.");
  }
  // Update resetPassword Token & Expires in user data
  user.resetPasswordToken = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "1h",
  });
  user.resetPasswordExpires = Date.now() + 3600000;

  await User.updateOne({ email }, user);

  // Send a reset link to user mail, where host is the host url for the server
  const resetURL = `http://${host}/api/v1/auth/confirm-reset-password?token=${user.resetPasswordToken}`;
  await mailHelpers.send({
    user,
    filename: "password-reset",
    subject: "Password Reset",
    resetURL,
  });

  // Return user
  return user;
};

exports.confirmResetPassword = async (token) => {
  // Check for user with the resetPassword Token & Expires
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Password reset is invalid or has expired");
  }

  // Generate new password
  let password = randomPassword();
  Logger.info(`Password was generated: ${password}`);

  // Upadate user password
  user.password = password;
  user.resetPassword = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await User.updateOne({ email: user.email }, user);
  user.save();

  // Mail the new password to the user
  const newPassword = password.toLowerCase();
  await mailHelpers.send({
    user,
    filename: "generated-password",
    subject: "Password Reset",
    newPassword,
  });

  // Return User
  return user;
};

exports.updatePassword = async (user_email, currentPass, newPass) => {
  // Find user with email
  const user = await User.findOne({ email: user_email });

  // Compare hashed password
  const isValidPassword = await bcrypt.compareSync(currentPass, user.password);
  if (!isValidPassword) {
    Logger.warn("Current Password Inputed is wrong");
    throw new Error("Current Password Inputed is wrong");
  }

  // Update the password in the database
  user.password = newPass;
  user.resetPassword = undefined;

  await User.updateOne({ email: user_email }, user);
  user.save();

  // Return Updated User
  return user;
};
exports.deleteAcct = async (userQuery) => {
  await User.findOneAndRemove(userQuery);
  return true;
};
