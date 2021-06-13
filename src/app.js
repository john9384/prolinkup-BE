const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const {
  fileFilter,
  fileStorage,
} = require("./library/middlewares/multerMiddleware");

const config = require("./config");
const userComponents = require("./components").user;
const postComponents = require("./components").post;
const profileComponents = require("./components").profile;

const app = express();
// Static folder for uploads
app.use("/src/uploads", express.static("src/uploads"));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(
  express.urlencoded({
    limit: "2mb",
    extended: true,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(cookieParser());
app.use(helmet());
app.set("trust proxy", 1);

app.use(`${config.api.prefix}/user`, userComponents.routes);
app.use(`${config.api.prefix}/post`, postComponents.routes);
app.use(`${config.api.prefix}/profile`, profileComponents.routes);
app.get("/", (req, res) => res.json({ msg: "App Running" }));
module.exports = app;
