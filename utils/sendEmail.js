const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    // 1) create Transporter (service that will send email)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // if secure = false port = 587, if secure = true port = 465
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) define email options (from... to.. email content...)
    const mailOptions = {
        from: 'E-shop app',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3) send Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
