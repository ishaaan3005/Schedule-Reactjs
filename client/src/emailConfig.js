// emailConfig.js

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Your Gmail address
    pass: 'your_password' // Your Gmail password or an app-specific password if you have 2-step verification enabled
  }
});

module.exports = transporter;
