// npm install nodemailer

import nodemailer from "nodemailer"
import { htmlCode } from "./emailTemplate.js"

export const sendeEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS,
        },
    });

    let token = jwt.sign({email} , 'sendingEmail')
    const info = await transporter.sendMail({
        from: `"Fashion-Designer" <${process.env.EMAIL_NAME}>`, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: htmlCode // html body
    });

    console.log("Message sent: %s", info.messageId);
}