const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
//the node mailer need a transporter to connect to gmail server
//so we create it once and then reuse it 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user : process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
const sendEmail = async(to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
};

module.exports = sendEmail;