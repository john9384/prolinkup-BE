const dotenv = require("dotenv");
const envFound = dotenv.config({ path: ".env" });

if (process.env.NODE_ENV) {
  module.exports = require("./config_prod");
} else {
  if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }

  module.exports = require("./config_dev");
}
