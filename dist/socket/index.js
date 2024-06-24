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
exports.initializeSocketIO = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const index_1 = require("../models/index");
const api_error_1 = require("../utils/api-error");
const chat_model_1 = require("../models/chat.model");
const conversationsObject = {};
const authorizeEvent = (socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = data === null || data === void 0 ? void 0 : data.token; // get the accessToken
        if (!token) {
            // If there is no access token in cookies. Check inside the handshake auth
            token = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token;
        }
        if (!token) {
            // Token is required for the socket to work
            throw new api_error_1.ApiError(401, "Unauthorized handshake. Token is missing");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token
        const user = yield index_1.UserModel.findById(decodedToken).select("-password -refreshToken");
        // retrieve the user
        if (!user) {
            throw new api_error_1.ApiError(401, "Unauthorized handshake. Token is invalid");
        }
        // create chat socket events
        const chatsByUserId = yield (0, chat_model_1.getChatsByUserId)(user._id);
        chatsByUserId === null || chatsByUserId === void 0 ? void 0 : chatsByUserId.forEach((ele) => {
            if (conversationsObject[ele._id]) {
                const sockets = [...conversationsObject[ele._id], socket];
                conversationsObject[ele._id] = sockets;
            }
            else {
                conversationsObject[ele._id] = [socket];
            }
        });
    }
    catch (error) {
        console.log('Something went wrong', error);
    }
});
const initializeSocketIO = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('New connection');
        socket.on('message', (res) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                const data = JSON.parse(res);
                if (data.event === constants_1.ChatEventEnum.CONNECTED_EVENT) {
                    yield authorizeEvent(socket, data);
                    console.log('Connected: new user connected', io.clients.size);
                }
                else if (data.event === constants_1.ChatEventEnum.JOIN_CHAT_EVENT) {
                    if (conversationsObject[data.chatId]) {
                        const sockets = [...conversationsObject[data.chatId], socket];
                        conversationsObject[data.chatId] = sockets;
                    }
                    else {
                        conversationsObject[data.chatId] = [socket];
                    }
                }
                else if (data.event === constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                    (_a = conversationsObject[data.chatId]) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                        if (item !== socket) {
                            item.send(JSON.stringify(data));
                        }
                    });
                }
                else if (data.event === constants_1.ChatEventEnum.TYPING_EVENT) {
                    (_b = conversationsObject[data.chatId]) === null || _b === void 0 ? void 0 : _b.forEach((item) => {
                        if (item !== socket) {
                            item.send(JSON.stringify(data));
                        }
                    });
                }
            }
            catch (error) {
                console.log('Error while handling message', error);
            }
        }));
        socket.on("error", (error) => {
            console.log("Socket error:", error);
        });
        socket.on('close', (code, reason) => {
            console.log('Client disconnected', { code, reason });
            for (let chatId in conversationsObject) {
                let sockets = conversationsObject[chatId];
                sockets = sockets === null || sockets === void 0 ? void 0 : sockets.filter((item) => item !== socket);
                conversationsObject[chatId] = sockets;
            }
        });
    }));
};
exports.initializeSocketIO = initializeSocketIO;
