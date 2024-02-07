"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPasswordMailOptions = exports.RegisterMailOptions = exports.SendMail = void 0;
require('dotenv').config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_APP_PASSWORD,
    },
});
function SendMail(mailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("Mail Successfully sent: %s", info.messageId);
        }
        catch (error) {
            console.log('Error while Mail sent', error.message);
        }
    });
}
exports.SendMail = SendMail;
const RegisterMailOptions = (user, confirmationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmationLink = `http://localhost:8000/v1/user/confirm-mail?token=${confirmationToken}`;
    try {
        // Use util.promisify to convert ejs.renderFile to a promise-based function
        const renderFileAsync = require('util').promisify(ejs_1.default.renderFile);
        // Render the EJS template
        const data = yield renderFileAsync(path_1.default.join(__dirname, '../views', 'signup-email-view.ejs'), {
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
    }
    catch (err) {
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
});
exports.RegisterMailOptions = RegisterMailOptions;
const ForgetPasswordMailOptions = (user, confirmationToken) => {
    const confirmationLink = `http://localhost:8000/v1/user/forget-password?token=${confirmationToken}`;
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
    };
};
exports.ForgetPasswordMailOptions = ForgetPasswordMailOptions;
