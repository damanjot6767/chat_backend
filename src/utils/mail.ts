"use strict";
require('dotenv').config();
import nodemailer from "nodemailer";
import ejs from 'ejs';
import path from 'path';
import { User } from "../controllers/users/dto/user-dto";
import { FrontendRoutes } from "../constants";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_APP_PASSWORD,
    },
});

export async function SendMail(mailOptions) {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Mail Successfully sent: %s", info.messageId);
    } catch (error) {
        console.log('Error while Mail sent', error.message)
    }
}



export const RegisterMailOptions = async (user:User, confirmationToken: string) => {
    const confirmationLink = `https://chat-2tir.onrender.com/v1/user/confirm-mail?token=${confirmationToken}`;

    try {
        // Use util.promisify to convert ejs.renderFile to a promise-based function
        const renderFileAsync = require('util').promisify(ejs.renderFile);

        // Render the EJS template
        const data = await renderFileAsync(
            path.join(
                __dirname,
                '../views',
                'signup-email-view.ejs'
            ),
            {
                userEmail: user.email,
                userName: user.fullName,
                link: confirmationLink
            });

        // Return the email configuration object
        return {
            from: {
                name: 'Free Chat',
                address: process.env.NODEMAIL_USER,
            },
            to: 'damanjot6767@gmail.com',
            subject: 'Welcome to free chat ✔',
            text: 'Hello world?',
            html: data,
        };
    } catch (err) {
        console.error('Error rendering EJS template:', err);
        // Handle the error, e.g., return a default email configuration object
        return {
            from: {
                name: 'Free Chat',
                address: process.env.NODEMAIL_USER,
            },
            to: 'damanjot6767@gmail.com',
            subject: 'Error in rendering email template',
            text: 'Error rendering email template',
            html: '<p>Error rendering email template</p>',
        };
    }
};

export const ForgetPasswordMailOptions = (user: User, confirmationToken: string) => {

    const confirmationLink = `${process.env.FRONTEND_REDIRECT_URL+FrontendRoutes.NewPassword}?token=${confirmationToken}`

    return {
        from: {
            name: 'Free Chat',
            address: process.env.NODEMAIL_USER
        },
        to: user.email, // list of receivers
        subject: "Forget password to Free chat", // Subject line
        html: `
        <p>Hello,</p>
        <p>Click the following link to forget your password:</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
      `, // html body
    }
}