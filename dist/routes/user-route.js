"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/users/user-controller");
const validation_1 = require("../controllers/users/validation");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const passport_1 = __importDefault(require("passport"));
const login_user_validation_1 = require("../controllers/users/validation/login-user-validation");
const create_user_validation_1 = require("../controllers/users/validation/create-user-validation");
const update_user_validation_1 = require("../controllers/users/validation/update-user-validation");
const routes = [
    {
        method: 'post',
        path: '/v1/user/login',
        joiSchemaForSwagger: {
            body: login_user_validation_1.loginUserJoiValidationObject,
            group: 'User',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'User_Login'
        },
        middlewares: [validation_1.LoginUserJoiValidation],
        auth: false,
        handler: user_controller_1.loginUser
    },
    {
        method: 'post',
        path: '/v1/user/register',
        joiSchemaForSwagger: {
            body: create_user_validation_1.createUserJoiValidationObject,
            group: 'User',
            description: `Route to login a user of any role.`,
            model: 'User_Register'
        },
        middlewares: [validation_1.CreateUserJoiValidation],
        auth: false,
        handler: user_controller_1.registerUser
    },
    {
        method: 'get',
        path: '/v1/user/get-all-users',
        joiSchemaForSwagger: {
            group: 'User',
            description: `Route to get all user of any role.`,
            model: 'Users'
        },
        middlewares: [auth_middleware_1.verifyJWT],
        auth: true,
        handler: user_controller_1.getAllUsers
    },
    {
        method: 'get',
        path: '/v1/user/confirm-mail',
        joiSchemaForSwagger: {
            body: create_user_validation_1.createUserJoiValidationObject,
            group: 'User',
            description: `Route to confirm user mail.`,
            model: 'Users'
        },
        middlewares: [auth_middleware_1.verifyJWT],
        auth: true,
        handler: user_controller_1.confirmMail
    },
    {
        method: 'post',
        path: '/v1/user/forget-password',
        joiSchemaForSwagger: {
            group: 'User',
            description: `Route to forget user password.`,
        },
        middlewares: [],
        auth: false,
        handler: user_controller_1.forgetPassword
    },
    {
        method: 'post',
        path: '/v1/user/change-password',
        joiSchemaForSwagger: {
            group: 'User',
            description: `Route to change forget user password.`,
        },
        middlewares: [auth_middleware_1.verifyMailJWT],
        auth: true,
        handler: user_controller_1.changeForgetPassword
    },
    {
        method: 'get',
        path: '/v1/user/verify-email',
        joiSchemaForSwagger: {
            group: 'User',
            description: `Route to change forget user password.`,
        },
        middlewares: [auth_middleware_1.verifyJWT],
        auth: true,
        handler: user_controller_1.verifyEmail
    },
    {
        method: 'get',
        path: '/v1/user/:id',
        joiSchemaForSwagger: {
            group: 'User',
            description: `Route get users and user by id.`,
        },
        middlewares: [auth_middleware_1.verifyJWT],
        auth: true,
        handler: user_controller_1.getUser
    },
    {
        method: 'post',
        path: '/v1/user/update/:id',
        joiSchemaForSwagger: {
            group: 'User',
            params: validation_1.getUserByIdParamJoiValidationObject,
            body: update_user_validation_1.updateUserJoiValidationObject,
            description: `Route to change forget user password.`,
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetUserByIdParamJoiValidation, validation_1.UpdateUserJoiValidation],
        auth: true,
        handler: user_controller_1.getUser
    },
    {
        method: 'get',
        path: '/v1/user/auth/google',
        joiSchemaForSwagger: {
            group: 'User',
            body: update_user_validation_1.updateUserJoiValidationObject,
            description: `Route to change forget user password.`,
        },
        middlewares: [passport_1.default.authenticate("google", { scope: ["profile", "email"] })],
        auth: true,
        handler: (req, res) => {
            res.send("redirecting to google...");
        }
    },
    {
        method: 'get',
        path: '/v1/user/auth/google/callback',
        joiSchemaForSwagger: {
            group: 'User',
            body: update_user_validation_1.updateUserJoiValidationObject,
            description: `Route to change forget user password.`,
        },
        middlewares: [passport_1.default.authenticate("google", { session: false })],
        auth: true,
        handler: user_controller_1.handleSocialLogin
    },
];
exports.default = routes;
