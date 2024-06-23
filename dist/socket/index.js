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
;
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
            throw new api_error_1.ApiError(401, "Un-authorized handshake. Token is missing");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token
        const user = yield index_1.UserModel.findById(decodedToken).select("-password -refreshToken ");
        // retrieve the user
        if (!user) {
            throw new api_error_1.ApiError(401, "Un-authorized handshake. Token is invalid");
        }
        socket.user = user; // mount te user object to the socket
    }
    catch (error) {
        socket;
    }
});
const initializeSocketIO = (io) => {
    return io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (data.event === constants_1.ChatEventEnum.CONNECTED_EVENT) {
                    yield authorizeEvent(socket, data);
                    console.log('connected', 'new user connected ');
                }
                else if (data.event === constants_1.ChatEventEnum.JOIN_CHAT_EVENT) {
                    if (conversationsObject[data.chatId]) {
                        conversationsObject[data.chatId] = conversationsObject[data.chatId].push(socket);
                    }
                    else {
                        conversationsObject[data.chatId] = [socket];
                    }
                }
                else if (data.event === constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                    (_a = conversationsObject[data.chatId]) === null || _a === void 0 ? void 0 : _a.map((item) => {
                        if (item !== socket) {
                            socket.send(data);
                        }
                    });
                }
                else if (data.event === constants_1.ChatEventEnum.TYPING_EVENT) {
                    (_b = conversationsObject[data.chatId]) === null || _b === void 0 ? void 0 : _b.map((item) => {
                        if (item !== socket) {
                            socket.send(data);
                        }
                    });
                }
            }
            catch (error) {
                socket.on("error", () => {
                    console.log("soceket error while receiving event");
                });
            }
        }));
        socket.on("error", () => {
            console.log("soceket error while connecting socket");
        });
        console.log('new connection');
    }));
};
exports.initializeSocketIO = initializeSocketIO;
