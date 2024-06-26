
import { verifyJWT } from "../middlewares/auth-middleware";
import { CreateMessageJoiValidation, GetMessageByIdParamJoiValidation, UpdateMessageJoiValidation, createMessageJoiValidationObject, getMessageByIdParamJoiValidationObject } from "../controllers/messages/validation";
import { createMessage, deleteMessage, getMessagesByChatId, updateMessage } from "../controllers/messages/message-controller";


const routes = [
    {
		method: 'post',
		path: '/v1/message/create',
		joiSchemaForSwagger: {
			body: createMessageJoiValidationObject,
			group: 'Message',
			description: `Route to login a user of any role.`,
			// payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
			model: 'Message'
		},
        middlewares : [CreateMessageJoiValidation],
		auth: false,
		handler: createMessage
	},
    {
		method: 'post',
		path: '/v1/message/update/:id',
		joiSchemaForSwagger: {
            params: getMessageByIdParamJoiValidationObject,
            body: UpdateMessageJoiValidation,
			group: 'Message',
			description: `Route to update message.`,
		},
        middlewares : [verifyJWT, GetMessageByIdParamJoiValidation, UpdateMessageJoiValidation],
		auth: true,
		handler: updateMessage
	},
    {
		method: 'delete',
		path: '/v1/message/delete/:id',
		joiSchemaForSwagger: {
            params: getMessageByIdParamJoiValidationObject,
			group: 'Message',
			description: `Route to update message.`,
		},
        middlewares : [verifyJWT, GetMessageByIdParamJoiValidation],
		auth: true,
		handler: deleteMessage
	},
    {
		method: 'get',
		path: '/v1/message/by-chat-id/:id',
		joiSchemaForSwagger: {
            params: getMessageByIdParamJoiValidationObject,
			group: 'Message',
			description: `Route to update message.`,
		},
        middlewares : [verifyJWT, GetMessageByIdParamJoiValidation],
		auth: true,
		handler: getMessagesByChatId
	},
]

export default routes;