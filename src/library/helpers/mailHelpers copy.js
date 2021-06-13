const fs = require("fs");
const nodemailer = require("nodemailer");
const Hogan = require("hogan.js");
const htmlToText = require("html-to-text");
const logger = require("./loggerHelpers");
const config = require("../../config");

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.password
  }
});

const generateHTML = (filename, options = {}) => {
  let template = fs.readFileSync(`./src/view/email/${filename}.hjs`, "utf-8");
  let compiledTemplate = Hogan.compile(template);

  return compiledTemplate.render(options);
};

exports.send = async options => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `E-office   support@e-office.com`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  return transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err);
    } else {
      logger.info(info);
    }
  });
};
