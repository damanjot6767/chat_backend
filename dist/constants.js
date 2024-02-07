"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = exports.AvailableChatType = exports.ChatType = exports.AvailableSocialLogins = exports.UserLoginType = exports.cookieOptions = exports.ChatEventEnum = exports.AvailableUserRoles = exports.UserRolesEnum = exports.DB_NAME = void 0;
exports.DB_NAME = 'chat';
exports.UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};
exports.AvailableUserRoles = Object.values(exports.UserRolesEnum);
var ChatEventEnum;
(function (ChatEventEnum) {
    ChatEventEnum["CONNECTED_EVENT"] = "connected";
    ChatEventEnum["DISCONNECT_EVENT"] = "disconnect";
    ChatEventEnum["JOIN_CHAT_EVENT"] = "joinChat";
    ChatEventEnum["LEAVE_CHAT_EVENT"] = "leaveChat";
    ChatEventEnum["UPDATE_GROUP_NAME_EVENT"] = "updateGroupName";
    ChatEventEnum["MESSAGE_RECEIVED_EVENT"] = "messageReceived";
    ChatEventEnum["NEW_CHAT_EVENT"] = "newChat";
    ChatEventEnum["SOCKET_ERROR_EVENT"] = "socketError";
    ChatEventEnum["STOP_TYPING_EVENT"] = "stopTyping";
    ChatEventEnum["TYPING_EVENT"] = "typing";
})(ChatEventEnum || (exports.ChatEventEnum = ChatEventEnum = {}));
exports.cookieOptions = {
    httpOnly: true,
    secure: false, // Adjust this based on your environment (e.g., use `true` in production with HTTPS)
};
var UserLoginType;
(function (UserLoginType) {
    UserLoginType["GOOGLE"] = "GOOGLE";
    UserLoginType["GITHUB"] = "GITHUB";
    UserLoginType["EMAIL_PASSWORD"] = "EMAIL_PASSWORD";
})(UserLoginType || (exports.UserLoginType = UserLoginType = {}));
;
exports.AvailableSocialLogins = Object.values(UserLoginType);
var ChatType;
(function (ChatType) {
    ChatType["INDIVIDUAL"] = "INDIVIDUAL";
    ChatType["GROUP"] = "GROUP";
})(ChatType || (exports.ChatType = ChatType = {}));
;
exports.AvailableChatType = Object.values(ChatType);
exports.swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Library API",
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.ts'],
};
