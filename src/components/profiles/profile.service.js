const mongoose = require("mongoose");
const passport = require("passport");
const logger = require("../../library/helpers/loggerHelpers");

// Load the profile model
const Profile = require("./profile.model");
// Load the user model
const User = require("../users/users.model");

exports.findOneProfile = async (query) => {
  const profile = await Profile.findOne(query);
  return profile;
};
exports.findUserProfile = async (query) => {
  const profile = await Profile.findOne(query);
  if (!profile) {
    logger.warn("No Profile found.");
    throw new Error("No Profile Found");
  }

  return profile;
};
exports.findAllProfiles = async () => {
  const profiles = await Profile.find().populate("users", ["name", "avatar"]);
  if (!profiles) {
    logger.warn("There are no Profiles");
    throw new Error("There are no Profiles");
  }
  return profiles;
};

exports.saveUserProfile = async (profileFields) => {
  // Save Profile

  const newProfile = await new Profile(profileFields);
  await newProfile.save();
  return newProfile;
};

exports.updateProfile = async (user, profileFields) => {
  // Update

  const updateProfile = await Profile.findOneAndUpdate(
    { user: user },
    { $set: profileFields },
    { new: true }
  );
  return updateProfile;
};

exports.updateImage = async (user_id, imgUrl) => {
  const updated_profile = await Profile.findOne({
    user: user_id,
  });
  updated_profile.imgUrl = imgUrl;
  updated_profile.save();
  return updated_profile;
};
exports.updateBgImage = async (user_id, imgUrl) => {
  const updated_profile = await Profile.findOne({
    user: user_id,
  });
  updated_profile.bgImgUrl = imgUrl;
  updated_profile.save();
  return updated_profile;
};

exports.saveUserExperience = async (profile, newExp) => {
  // Add to exp array
  profile.experience.unshift(newExp);
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: profile.user },
    { $set: profile },
    { new: true }
  );
  return updatedProfile;
};
exports.saveUserEducation = async (profile, newEdu) => {
  // Add to exp array
  profile.education.push(newEdu);

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: profile.user },
    { $set: profile },
    { new: true }
  );
  return updatedProfile;
};
exports.removeExperience = async (profile, param) => {
  // Get remove index
  const removeIndex = profile.experience.map((item) => item._id).indexOf(param);

  // Splice out of array
  profile.experience.splice(removeIndex, 1);

  // Save
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: profile.user },
    { $set: profile },
    { new: true }
  );
  return updatedProfile;
};
exports.removeEducation = async (profile, param) => {
  // Get remove index
  const removeIndex = profile.education.map((item) => item._id).indexOf(param);

  // Splice out of array
  profile.education.splice(removeIndex, 1);

  // Save
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: profile.user },
    { $set: profile },
    { new: true }
  );
  return updatedProfile;
};
exports.deleteProfile = async (profileQuery) => {
  await Profile.findOneAndRemove(profileQuery);
  return true;
};
