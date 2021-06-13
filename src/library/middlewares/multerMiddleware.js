const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.removeFile = async (imgPath) => {
  try {
    // const realPath = imgPath.replace("http://localhost:4000/src/", "");
    // const x = path.join(__dirname, `../../${realPath}`);
    fs.unlinkSync(imgPath);
  } catch (err) {
    console.log(err);
  }
};

exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
    //cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
