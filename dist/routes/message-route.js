"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth-middleware");
const validation_1 = require("../controllers/messages/validation");
const message_controller_1 = require("../controllers/messages/message-controller");
const routes = [
    {
        method: 'post',
        path: '/v1/message/create',
        joiSchemaForSwagger: {
            body: validation_1.createMessageJoiValidationObject,
            group: 'Message',
            description: `Route to login a user of any role.`,
            // payloadDocumentation: `## Request body will contains: \n \n **email:** email of the user \n **password:** password of the user \n **isMobile:** Is request is coming from mobile application or not? \n **deviceToken:** user's device token for push notifications \n **appType:** from which application user is requesting login \n`,
            model: 'Message'
        },
        middlewares: [validation_1.CreateMessageJoiValidation],
        auth: false,
        handler: message_controller_1.createMessage
    },
    {
        method: 'post',
        path: '/v1/message/update/:id',
        joiSchemaForSwagger: {
            params: validation_1.getMessageByIdParamJoiValidationObject,
            body: validation_1.UpdateMessageJoiValidation,
            group: 'Message',
            description: `Route to update message.`,
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetMessageByIdParamJoiValidation, validation_1.UpdateMessageJoiValidation],
        auth: true,
        handler: message_controller_1.updateMessage
    },
    {
        method: 'delete',
        path: '/v1/message/delete/:id',
        joiSchemaForSwagger: {
            params: validation_1.getMessageByIdParamJoiValidationObject,
            group: 'Message',
            description: `Route to update message.`,
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetMessageByIdParamJoiValidation],
        auth: true,
        handler: message_controller_1.deleteMessage
    },
    {
        method: 'get',
        path: '/v1/message/by-chat-id/:id',
        joiSchemaForSwagger: {
            params: validation_1.getMessageByIdParamJoiValidationObject,
            group: 'Message',
            description: `Route to update message.`,
        },
        middlewares: [auth_middleware_1.verifyJWT, validation_1.GetMessageByIdParamJoiValidation],
        auth: true,
        handler: message_controller_1.getMessagesByChatId
    },
];
exports.default = routes;
