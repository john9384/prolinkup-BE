const express = require("express");
const router = express.Router();

// Load the helpers
const { catchErrors } = require("../../library/helpers/errorHandlers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");
// Load the controller
const profileController = require("./profile.controller");

router.get("/test", getAuthorize, (req, res) =>
  res.json({ msg: "Profile Routes functions" })
);
router.post("/", getAuthorize, catchErrors(profileController.postUserProfile));

// @route   POST /profile img
// @desc    Get profile by id
// @access  Private
router.post(
  "/upload/img",
  getAuthorize,
  catchErrors(profileController.uploadImg)
);

// @route   POST /background-image
// @desc    Get profile by id
// @access  Private
router.post(
  "/upload/bg-img",
  getAuthorize,
  catchErrors(profileController.uploadBgImg)
);
// @route   POST /experience
// @desc    Get profile by id
// @access  Private
router.post(
  "/experience",
  getAuthorize,
  catchErrors(profileController.postUserExperience)
);
// @route   POST /education
// @desc    Get profile by id
// @access  Private
router.post(
  "/education",
  getAuthorize,
  catchErrors(profileController.postUserEducation)
);
// @route   GET /profile
// @desc    Get profile by handle
// @access  Public
router.get("/", getAuthorize, catchErrors(profileController.getUserProfile));

// @route   GET /profile/all
// @desc    Get profile of all users
// @access  Public
router.get("/all", catchErrors(profileController.getAllUserProfiles));

// @route   GET /profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get(
  "/handle/:handle",
  catchErrors(profileController.getProfileByHandle)
);

// @route   GET /profile/user/:user_id
// @desc    Get profile by id
// @access  Public
router.get("/:user_id", catchErrors(profileController.getProfileById));

// @route   POST /profile
// @desc    Get profile by id
// @access  Public

router.post("/", getAuthorize, catchErrors(profileController.postUserProfile));

// @route   POST /experience
// @desc    Get profile by id
// @access  Public
router.post(
  "/experience",
  getAuthorize,
  catchErrors(profileController.postUserExperience)
);
// @route   POST /education
// @desc    Get profile by id
// @access  Public
router.post(
  "/education",
  getAuthorize,
  catchErrors(profileController.postUserEducation)
);

// @route   delete /experience/:id
// @desc    Get profile by id
// @access  Public\

router.delete(
  "/experience/:exp_id",
  getAuthorize,
  catchErrors(profileController.deleteUserExperience)
);

// @route   delete /experience/:id
// @desc    Get profile by id
// @access  Public\

router.delete(
  "/education/:edu_id",
  getAuthorize,
  catchErrors(profileController.deleteUserEducation)
);

// @route   delete /experience/:id
// @desc    Get profile by id
// @access  Public\

router.delete(
  "/",
  getAuthorize,
  catchErrors(profileController.deleteUserProfile)
);
module.exports = router;
