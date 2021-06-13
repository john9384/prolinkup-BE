const fs = require("fs");
const path = require("path");
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require("http-status-codes");
const profileService = require("./profile.service");
const userService = require("../users/users.service");
const validator = require("../../library/helpers/validatorHelper");
const { sentenceCase } = require("../../library/helpers/stringHelpers");
const logger = require("../../library/helpers/loggerHelpers");
const isEmpty = require("../../library/helpers/is-empty");
const CustomError = require("../../library/middlewares/customError");
const { removeFile } = require("../../library/middlewares/multerMiddleware");
const {
  SuccessResponse,
  FailResponse,
} = require("../../library/helpers/responseHelpers");

/**
  @param {String} path Profile load path
  @return {Profile} Profile instance
  @api private
 */
exports.postUserProfile = async (req, res) => {
  try {
    const {
      handle,
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;
    const error = await validator.validateProfileInput(req.body);

    if (error.state === true) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(
          new FailResponse.Builder()
            .withContent(error)
            .withMessage("Form validation error")
            .build()
        );
    }
    const profileFields = {};
    const user = await userService.findUserByEmail(req.decoded.payload.email);

    profileFields.user = user.id;
    profileFields.avatar = user.avatar;
    profileFields.username = `${user.firstname} ${user.lastname}`;
    profileFields.handle = handle;
    profileFields.company = sentenceCase(company);
    profileFields.website = website;
    profileFields.location = sentenceCase(location);
    profileFields.bio = bio;
    profileFields.status = status;
    profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (!isEmpty(skills) && typeof skills !== "undefined") {
      profileFields.skills = skills.split(",");
    }

    // Social
    profileFields.social = {};
    profileFields.social.youtube = youtube;
    profileFields.social.twitter = twitter;
    profileFields.social.facebook = facebook;
    profileFields.social.linkedin = linkedin;
    profileFields.social.instagram = instagram;

    const profileToBeUpdated = await profileService.findOneProfile({
      user: user.id,
    });
    if (profileToBeUpdated) {
      const profile = await profileService.updateProfile(user, profileFields);
      return res.json(
        new SuccessResponse.Builder()
          .withContent(profile)
          .withMessage("User Profile Updated")
          .build()
      );
    }
    const profileToBeSaved = await profileService.findOneProfile({
      handle: profileFields.handle,
    });
    if (profileToBeSaved) {
      logger.warn("The handle already exist");
      let error = {
        field: "handle",
        detail: "The handle already exist",
      };
      throw new CustomError(error);
    }
    const profile = await profileService.saveUserProfile(profileFields);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Profile Saved")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err)
          .withMessage(err.message)
          .build()
      );
  }
};

/**
 * @name PostImage
 * @return {Profile} Current user profile data
 * @api private
 */
exports.uploadImg = async (req, res) => {
  try {
    const imgUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
      req.file ? req.file.filename : null
    }`;

    // Check if the user from the request body exists
    const curr_user = await userService.findUserByEmail(
      req.decoded.payload.email
    );
    if (!curr_user) {
      throw new Error("User does not exist");
    }
    // Check if profile exists then update
    const profile_to_be_updated = await profileService.findUserProfile({
      user: curr_user._id,
    });
    if (!profile_to_be_updated) {
      throw new Error("No profile for this user");
    }
    //Check if there is a file in the form body
    if (imgUrl.includes("null")) {
      throw new Error("No Image uploaded");
    }
    // Remove the image on server if exist

    if (profile_to_be_updated.imgUrl) {
      const realPath = profile_to_be_updated.imgUrl.replace(
        "http://localhost:4000/src/",
        ""
      );
      const exactPath = path.join(__dirname, `../../${realPath}`);
      if (fs.existsSync(exactPath)) {
        await removeFile(exactPath);
      }
    }

    const profile = await profileService.updateImage(curr_user._id, imgUrl);

    return res
      .status(200)
      .json(
        new SuccessResponse.Builder()
          .withContent(profile)
          .withMessage("Image Uploaded")
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
 * @name PostImage
 * @return {Profile} Current user profile data
 * @api private
 */
exports.uploadBgImg = async (req, res) => {
  try {
    const imgUrl = `${req.protocol}://${req.get("host")}/src/uploads/${
      req.file ? req.file.filename : null
    }`;
    // Check if the user from the request body exists
    const curr_user = await userService.findUserByEmail(
      req.decoded.payload.email
    );
    if (!curr_user) {
      throw new Error("User does not exist");
    }
    // Check if profile exists then update
    const profile_to_be_updated = await profileService.findUserProfile({
      user: curr_user._id,
    });
    if (!profile_to_be_updated) {
      throw new Error("No profile for this user");
    }
    //Check if there is a file in the form body
    if (imgUrl.includes("null")) {
      throw new Error("No Image uploaded");
    }
    // Remove the image on server if exist
    if (profile_to_be_updated.bgImgUrl) {
      const realPath = profile_to_be_updated.bgImgUrl.replace(
        "http://localhost:4000/src/",
        ""
      );
      const exactPath = path.join(__dirname, `../../${realPath}`);
      if (fs.existsSync(exactPath)) {
        console.log("this checks as well");
        console.log(profile_to_be_updated.bgImgUrl);
        await removeFile(exactPath);
      }
    }

    const profile = await profileService.updateBgImage(curr_user._id, imgUrl);

    return res
      .status(200)
      .json(
        new SuccessResponse.Builder()
          .withContent(profile)
          .withMessage("Image Uploaded")
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
  @return {Profile} Profile instance
  @api private
 */
exports.postUserExperience = async (req, res) => {
  try {
    const error = await validator.validateUserExp(req.body);

    if (error.state === true) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(
          new FailResponse.Builder()
            .withContent(error)
            .withMessage(error.message)
            .build()
        );
    }
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const userProfile = await profileService.findOneProfile({
      user: user.id,
    });

    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    const profile = await profileService.saveUserExperience(
      userProfile,
      newExp
    );
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Experience Profile saved")
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
  @return {Profile} Profile instance
  @api private
 */
exports.postUserEducation = async (req, res) => {
  try {
    const error = await validator.validateUserEdu(req.body);

    if (error.state == true) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(
          new FailResponse.Builder()
            .withContent(error)
            .withMessage(error.message)
            .build()
        );
    }
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const userProfile = await profileService.findOneProfile({
      user: user.id,
    });
    console.log("gets in the user edu controller");
    console.log(req.body.from);
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    const profile = await profileService.saveUserEducation(userProfile, newEdu);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Education Profile saved")
        .build()
    );
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        new FailResponse.Builder()
          .withContent(err)
          .withMessage(err.message)
          .build()
      );
  }
};
/** 
  @param {String} path Profile load path
  @return {Profile} `Profile` instance
  @api private
*/
exports.getUserProfile = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await profileService.findUserProfile({ user: user.id });

    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Profile loaded")
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
  @return {Profile} `Profile` instance
  @api public
*/
exports.getAllUserProfiles = async (req, res) => {
  try {
    const profile = await profileService.findAllProfiles();
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("Profiles loaded")
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
  @return {Profile} Profile instance
  @api private
 */
exports.getProfileByHandle = async (req, res) => {
  try {
    const profile = await profileService.findUserProfile({
      handle: req.params.handle,
    });
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Profile loaded")
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
  @return {Profile} Profile instance
  @api private
 */
exports.getProfileById = async (req, res) => {
  try {
    const profile = await profileService.findUserProfile({
      user: req.params.user_id,
    });
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Profile loaded")
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
  @return {Profile} Profile instance
  @api private
 */
exports.deleteUserExperience = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const userProfile = await profileService.findOneProfile({
      user: user.id,
    });
    const param = req.params.exp_id;
    const profile = await profileService.removeExperience(userProfile, param);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Education Profile saved")
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
  @return {Profile} Profile instance
  @api private
 */
exports.deleteUserEducation = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const userProfile = await profileService.findOneProfile({
      user: user.id,
    });
    const param = req.params.edu_id;
    const profile = await profileService.removeEducation(userProfile, param);
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Education Profile saved")
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
  @return {Profile} Profile instance
  @api private
 */
exports.deleteUserProfile = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await profileService.deleteProfile(
      { user: user.id },
      { _id: user.id }
    );
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Education Profile saved")
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
exports.deleteUserAcct = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findUserByEmail(token);
    const profile = await profileService.deleteAcct({ _id: user.id });
    return res.json(
      new SuccessResponse.Builder()
        .withContent(profile)
        .withMessage("User Education Profile saved")
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
