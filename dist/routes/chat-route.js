"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth-middleware");
const validation_1 = require("../controllers/chats/validation");
const chat_controller_1 = require("../controllers/chats/chat-controller");
const routes = [
    {
        method: 'post',
        path: '/v1/chat/create',
        joiSchemaForSwagger: {
            body: validation_1.createChatJoiValidationObject,
            group: 'Chat',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Chat'
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.CreateChatJoiValidation],
        auth: true,
        handler: chat_controller_1.createChat
    },
    {
        method: 'get',
        path: '/v1/chat/:id',
        joiSchemaForSwagger: {
            params: validation_1.getChatParamJoiValidationObject,
            group: 'Chat',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Chat'
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetChatParamJoiValidation],
        auth: true,
        handler: chat_controller_1.getChatById
    },
    {
        method: 'get',
        path: '/v1/chat/chat-by-user-id/:userId',
        joiSchemaForSwagger: {
            params: validation_1.getChatByUserIdParamJoiValidationObject,
            group: 'Chat',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Chat'
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetChatByUserIdParamJoiValidation],
        auth: true,
        handler: chat_controller_1.getChatByUserId
    },
    {
        method: 'post',
        path: '/v1/chat/update/:id',
        joiSchemaForSwagger: {
            body: validation_1.updateChatJoiValidationObject,
            group: 'Chat',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Update Chat'
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.UpdateChatJoiValidation],
        auth: true,
        handler: chat_controller_1.updateChat
    },
    {
        method: 'delete',
        path: '/v1/chat/delete/:id',
        joiSchemaForSwagger: {
            params: validation_1.getChatParamJoiValidationObject,
            group: 'Chat',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Delete Chat'
        },
        middlewares: [auth_middleware_1.verifyJWT],
        auth: true,
        handler: chat_controller_1.deleteChat
    },
];
exports.default = routes;
