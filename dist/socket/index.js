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
exports.emitSocketEvent = exports.initializeSocketIO = void 0;
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const index_1 = require("../models/index");
const api_error_1 = require("../utils/api-error");
const mountJoinChatEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
        // E.g. When user types we don't want to emit that event to specific participant.
        // We want to just emit that to the chat where the typing is happening
        socket.join(chatId);
    });
};
const mountParticipantTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.TYPING_EVENT, (chatId) => {
        console.log('5');
        socket.in(chatId).emit(constants_1.ChatEventEnum.TYPING_EVENT, chatId);
    });
};
const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
};
const initializeSocketIO = (io) => {
    return io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
            const cookies = cookie_1.default.parse(((_a = socket.handshake.headers) === null || _a === void 0 ? void 0 : _a.cookie) || "");
            let token = cookies === null || cookies === void 0 ? void 0 : cookies.accessToken; // get the accessToken
            if (!token) {
                // If there is no access token in cookies. Check inside the handshake auth
                token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1NWFmOTE1NDM0YmIxYWMyZGFlN2QiLCJlbWFpbCI6Im5ld0BnbWFpbC5jb20iLCJmdWxsTmFtZSI6Im5ldyIsImxvZ2luVHlwZSI6IkVNQUlMX1BBU1NXT1JEIiwiaXNFbWFpbFZlcmlmaWVkIjpmYWxzZSwiaXNBY3RpdmUiOmZhbHNlLCJjb252ZXJzYXRpb25JZCI6W10sIm1lc3NhZ2VJZCI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDEtMjdUMTk6MzU6MjEuNzI5WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDEtMjlUMDQ6NDk6MDUuOTU1WiIsIl9fdiI6MCwiaWF0IjoxNzA2NTA5Njk1LCJleHAiOjE3MDY1OTYwOTV9.lwQc06mQlai6klLHLcBujADqoHkuGExG950FdBfgQnk';
            }
            if (!token) {
                // Token is required for the socket to work
                throw new api_error_1.ApiError(401, "Un-authorized handshake. Token is missing");
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token
            const user = yield index_1.UserModel.findById(decodedToken).select("-password -refreshToken ");
            // retrieve the user
            if (!user) {
                throw new api_error_1.ApiError(401, "Un-authorized handshake. Token is invalid");
            }
            socket.user = user; // mount te user object to the socket
            // We are creating a room with user id so that if user is joined but does not have any active chat going on.
            // still we want to emit some socket events to the user.
            // so that the client can catch the event and show the notifications.
            socket.join(user._id.toString());
            socket.emit(constants_1.ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
            console.log("User connected 🗼. userId: ", user._id.toString());
            // Common events that needs to be mounted on the initialization
            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);
            socket.on(constants_1.ChatEventEnum.DISCONNECT_EVENT, () => {
                var _a, _b;
                console.log("user has disconnected 🚫. userId: " + ((_a = socket.user) === null || _a === void 0 ? void 0 : _a._id));
                if ((_b = socket.user) === null || _b === void 0 ? void 0 : _b._id) {
                    socket.leave(socket.user._id);
                }
            });
        }
        catch (error) {
            socket.emit(constants_1.ChatEventEnum.SOCKET_ERROR_EVENT, (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong while connecting to the socket.");
        }
    }));
};
exports.initializeSocketIO = initializeSocketIO;
const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
};
exports.emitSocketEvent = emitSocketEvent;
