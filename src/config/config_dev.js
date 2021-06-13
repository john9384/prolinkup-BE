const dotenv = require("dotenv");
const envFound = dotenv.config({ path: "variables.env" });
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
module.exports = {
  appName: process.env.APP_NAME,
  port: 4000,
  dbURI: process.env.MONGODB_URI,
  dbContainer: process.env.MONGODB_URI_CONTAINER,
  jwtSecret: process.env.JWT_SECRET,
  tokenType: process.env.JWT_TOKEN_TYPE,
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },
  agendash: {
    user: "agendash",
    password: "123456",
  },
  api: {
    prefix: "/api/v1",
  },
  emails: {
    user: "jogungbure@gmail.com",
    password: "j1o2h3n4.,",
  },
};
