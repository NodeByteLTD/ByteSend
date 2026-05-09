const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  auth: {
    user: "bytesend",
    pass: "bs_123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const mailOptions = {
  to: "sender@example.com",
  from: "hello@example.com",
  subject: "Testing SMTP",
  html: "<strong>THIS IS USING SMTP,</strong><p>using ByteSend<p>",
  text: "hello,\n\nusing ByteSend",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});
