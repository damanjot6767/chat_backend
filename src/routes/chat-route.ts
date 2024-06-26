import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middleware";
import { CreateChatJoiValidation, GetChatByUserIdParamJoiValidation, GetChatParamJoiValidation, UpdateChatJoiValidation, createChatJoiValidationObject, getChatByUserIdParamJoiValidationObject, getChatParamJoiValidationObject, updateChatJoiValidationObject } from "../controllers/chats/validation";
import { createChat, deleteChat, getChatById, getChatByUserId, updateChat } from "../controllers/chats/chat-controller";


const routes = [
    {
		method: 'post',
		path: '/v1/chat/create',
		joiSchemaForSwagger: {
			body: createChatJoiValidationObject,
			group: 'Chat',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Chat'
		},
        middlewares : [verifyJWT, CreateChatJoiValidation],
		auth: true,
		handler: createChat
	},
    {
		method: 'get',
		path: '/v1/chat/:id',
		joiSchemaForSwagger: {
			params: getChatParamJoiValidationObject,
			group: 'Chat',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Chat'
		},
        middlewares : [verifyJWT, GetChatParamJoiValidation],
		auth: true,
		handler: getChatById
	},
    {
		method: 'get',
		path: '/v1/chat/chat-by-user-id/:userId',
		joiSchemaForSwagger: {
			params: getChatByUserIdParamJoiValidationObject,
			group: 'Chat',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Chat'
		},
        middlewares : [verifyJWT, GetChatByUserIdParamJoiValidation],
		auth: true,
		handler: getChatByUserId
	},
    {
		method: 'post',
		path: '/v1/chat/update/:id',
		joiSchemaForSwagger: {
			body: updateChatJoiValidationObject,
			group: 'Chat',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Update Chat'
		},
        middlewares : [verifyJWT, UpdateChatJoiValidation],
		auth: true,
		handler: updateChat
	},
    {
		method: 'delete',
		path: '/v1/chat/delete/:id',
		joiSchemaForSwagger: {
			params: getChatParamJoiValidationObject,
			group: 'Chat',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Delete Chat'
		},
        middlewares : [verifyJWT],
		auth: true,
		handler: deleteChat
	},
]

export default routes;