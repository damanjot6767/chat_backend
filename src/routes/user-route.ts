import { changeForgetPassword, confirmMail, getAllUsers, getUser, handleSocialLogin, loginUser, registerUser, updateUser, forgetPassword, verifyEmail } from "../controllers/users/user-controller";
import { CreateUserJoiValidation, GetUserByIdParamJoiValidation, LoginUserJoiValidation, UpdateUserJoiValidation, getUserByIdParamJoiValidationObject } from "../controllers/users/validation";
import { verifyJWT, verifyMailJWT } from "../middlewares/auth-middleware";
import passport from "passport";
import { loginUserJoiValidationObject } from "../controllers/users/validation/login-user-validation";
import { createUserJoiValidationObject } from "../controllers/users/validation/create-user-validation";
import { updateUserJoiValidationObject } from "../controllers/users/validation/update-user-validation";


const routes = [
    {
		method: 'post',
		path: '/v1/user/login',
		joiSchemaForSwagger: {
			body: loginUserJoiValidationObject,
			group: 'User',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'User_Login'
		},
        middlewares : [LoginUserJoiValidation],
		auth: false,
		handler: loginUser
	},
    {
		method: 'post',
		path: '/v1/user/register',
		joiSchemaForSwagger: {
			body: createUserJoiValidationObject,
			group: 'User',
			description: `Route to login a user of any role.`,
			model: 'User_Register'
		},
        middlewares : [CreateUserJoiValidation],
		auth: false,
		handler: registerUser
	},
    {
		method: 'get',
		path: '/v1/user/get-all-users',
		joiSchemaForSwagger: {
			group: 'User',
			description: `Route to get all user of any role.`,
			model: 'Users'
		},
        middlewares : [verifyJWT],
		auth: true,
		handler: getAllUsers
	},
    {
		method: 'get',
		path: '/v1/user/confirm-mail',
		joiSchemaForSwagger: {
			body: createUserJoiValidationObject,
			group: 'User',
			description: `Route to confirm user mail.`,
			model: 'Users'
		},
        middlewares : [verifyJWT],
		auth: true,
		handler: confirmMail
	},
    {
		method: 'post',
		path: '/v1/user/forget-password',
		joiSchemaForSwagger: {
			group: 'User',
			description: `Route to forget user password.`,
		},
        middlewares : [],
		auth: false,
		handler: forgetPassword
	},
    {
		method: 'post',
		path: '/v1/user/change-password',
		joiSchemaForSwagger: {
			group: 'User',
			description: `Route to change forget user password.`,
		},
        middlewares : [verifyMailJWT],
		auth: true,
		handler: changeForgetPassword
	},
    {
		method: 'get',
		path: '/v1/user/verify-email',
		joiSchemaForSwagger: {
			group: 'User',
			description: `Route to change forget user password.`,
		},
        middlewares : [verifyJWT],
		auth: true,
		handler: verifyEmail
	},
    {
		method: 'get',
		path: '/v1/user/:id',
		joiSchemaForSwagger: {
			group: 'User',
			description: `Route get users and user by id.`,
		},
        middlewares : [verifyJWT],
		auth: true,
		handler: getUser
	},
    {
		method: 'post',
		path: '/v1/user/update/:id',
		joiSchemaForSwagger: {
			group: 'User',
			params: getUserByIdParamJoiValidationObject,
            body: updateUserJoiValidationObject,
			description: `Route to change forget user password.`,
		},
        middlewares : [verifyJWT ,GetUserByIdParamJoiValidation, UpdateUserJoiValidation],
		auth: true,
		handler: getUser
	},
    {
		method: 'get',
		path: '/v1/user/auth/google',
		joiSchemaForSwagger: {
			group: 'User',
            body: updateUserJoiValidationObject,
			description: `Route to change forget user password.`,
		},
        middlewares : [passport.authenticate("google", {scope: ["profile", "email"]})],
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
            body: updateUserJoiValidationObject,
			description: `Route to change forget user password.`,
		},
        middlewares : [passport.authenticate("google", { session: false })],
		auth: true,
		handler: handleSocialLogin
	},
]

export default routes;