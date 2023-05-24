const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOps = {
    from: `E-shop comerce <${process.env.EMAIL_USER}>`,
    to: option.to,
    subject: option.subject,
    text: option.text
  };

  await transporter.sendMail(mailOps);
};

module.exports = sendEmail;
