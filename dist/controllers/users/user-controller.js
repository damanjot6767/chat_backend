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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.changeForgetPassword = exports.forgetPassword = exports.confirmMail = exports.getAllUsers = exports.handleSocialLogin = exports.updateUser = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const constants_1 = require("../../constants");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const mail_1 = require("../../utils/mail");
const user_service_1 = require("./user-service");
const registerUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, user_service_1.registerService)(req.body);
    const { token } = yield (0, user_service_1.generateTempraryToken)(response._id);
    res.
        status(201).
        cookie("accessToken", response.accessToken, constants_1.cookieOptions).
        json(new api_response_1.ApiResponse(201, response, 'We sent a link to your email please click on to verify your mail'));
    (0, mail_1.SendMail)(yield (0, mail_1.RegisterMailOptions)(response, token));
}));
exports.registerUser = registerUser;
const loginUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, user_service_1.loginService)(req.body);
    return res.
        status(200).
        cookie("accessToken", response.accessToken).
        json(new api_response_1.ApiResponse(201, response, 'User login successfully'));
}));
exports.loginUser = loginUser;
const handleSocialLogin = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield (0, user_service_1.handleSocialLoginService)((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    return res
        .status(301)
        .cookie("accessToken", response === null || response === void 0 ? void 0 : response.accessToken, constants_1.cookieOptions)
        .json(new api_response_1.ApiResponse(201, response, 'User login successfully'));
}));
exports.handleSocialLogin = handleSocialLogin;
const getUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const response = yield (0, user_service_1.getUserService)(req.user._id || ((_b = req.params) === null || _b === void 0 ? void 0 : _b.id));
    return res.
        status(200).
        json(new api_response_1.ApiResponse(201, response, 'User get successfully'));
}));
exports.getUser = getUser;
const getAllUsers = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, user_service_1.getAllUsersService)();
    return res.
        status(200).
        json(new api_response_1.ApiResponse(201, response, 'User get successfully'));
}));
exports.getAllUsers = getAllUsers;
const updateUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, user_service_1.updateUserService)(req.params.id, req.body);
    return res.
        status(200).
        json(new api_response_1.ApiResponse(201, response, 'User get successfully'));
}));
exports.updateUser = updateUser;
const confirmMail = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    let response;
    response = yield (0, user_service_1.getUserService)((_c = req.user) === null || _c === void 0 ? void 0 : _c._id);
    if (response.isEmailVerified) {
        res.render('mail-already-confirmed', {
            userEmail: response.email,
            userName: response.fullName,
            link: process.env.FRONTEND_REDIRECT_URL + constants_1.FrontendRoutes.Users
        });
        return;
    }
    response = yield (0, user_service_1.updateUserService)((_d = req.user) === null || _d === void 0 ? void 0 : _d._id, { isEmailVerified: true });
    res.render('mail-confirmation-success', {
        userEmail: response.email,
        userName: response.fullName,
        link: process.env.FRONTEND_REDIRECT_URL + constants_1.FrontendRoutes.Users
    });
}));
exports.confirmMail = confirmMail;
const forgetPassword = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByEmailService)(req.body.email);
    res.
        status(201).
        json(new api_response_1.ApiResponse(201, user, 'We sent forget password link please click on that link.'));
    if (user) {
        const { token } = yield (0, user_service_1.generateTempraryToken)(user._id);
        (0, mail_1.SendMail)((0, mail_1.ForgetPasswordMailOptions)(user, token));
    }
}));
exports.forgetPassword = forgetPassword;
const changeForgetPassword = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const response = yield (0, user_service_1.changePasswordService)((_e = req.user) === null || _e === void 0 ? void 0 : _e._id, (_f = req.body) === null || _f === void 0 ? void 0 : _f.new_password);
    // await SendMail(RegisterMailOptions([response.email], mailConfirmationToken))
    return res.
        status(201).
        json(new api_response_1.ApiResponse(201, response, 'password changed successfully'));
}));
exports.changeForgetPassword = changeForgetPassword;
const verifyEmail = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = yield (0, user_service_1.generateTempraryToken)(req.user._id);
    res.
        status(201).
        json(new api_response_1.ApiResponse(201, null, 'We sent a link to your email please click on to verify your mail'));
    (0, mail_1.SendMail)(yield (0, mail_1.RegisterMailOptions)(req.user, token));
}));
exports.verifyEmail = verifyEmail;
