module.exports = {
  appName: process.env.APP_NAME,
  port: process.env.PORT,
  dbURI: process.env.MONGODB_URI_REMOTE,
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
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
  },
};
