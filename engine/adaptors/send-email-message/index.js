const nodemailer = require("nodemailer");

module.exports = async function (args) {
  const transporter = nodemailer.createTransport({
    host: args["stmp host"],
    port: args["stmp port"],
    secure: args["stmp secure"],
    auth: {
      user: args["stmp username"],
      pass: args["stmp password"],
    },
  });

  const info = await transporter.sendMail({
    from: args["from address"],
    to: args["to address"],
    subject: args["subject"],
    text: args["text"],
  });

  return {
    "message id": info.messageId,
    response: info.response,
  };
};
