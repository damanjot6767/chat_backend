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
const redis_1 = require("../redis/redis");
const redis_pub_sub_1 = require("../redis/redis-pub-sub");
const message_redis_service_1 = require("../controllers/messages/message-redis-service");
const socketObject = {};
const storeSocketInstanceWithUserId = ({ userId, socket }) => {
    if (!socketObject[userId]) {
        socketObject[userId] = socket;
    }
    else {
        socketObject[userId] = socket;
    }
};
const removeSocketInstanceWithUserId = ({ socket }) => {
    for (let userId in socketObject)
        if (socketObject[userId] == socket) {
            delete socketObject[userId];
        }
};
const listenToChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        redis_1.redisSubscriberInstance.on('message', (channel, message) => __awaiter(void 0, void 0, void 0, function* () {
            const data = JSON.parse(message);
            if (channel === constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                const res = yield (0, message_redis_service_1.pushMessageRedis)(data.data);
                data.data = res;
                const sentBy = data.data.messageSentBy;
                const { userIds } = yield (0, redis_pub_sub_1.getHasSet)({ name: "chats", key: data.data.chatId.toString() });
                userIds === null || userIds === void 0 ? void 0 : userIds.map(({ userId }) => {
                    if (socketObject[userId]) {
                        socketObject[userId].send(JSON.stringify(data));
                    }
                });
            }
            else if (channel === constants_1.ChatEventEnum.TYPING_EVENT) {
                const sentBy = data.data.messageSentBy;
                const { userIds } = yield (0, redis_pub_sub_1.getHasSet)({ name: "chats", key: data.data.chatId.toString() });
                userIds === null || userIds === void 0 ? void 0 : userIds.map(({ userId }) => {
                    if (userId !== sentBy && socketObject[userId]) {
                        socketObject[userId].send(JSON.stringify(data));
                    }
                });
            }
        }));
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while subscribeToChannelWithChatId');
    }
});
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
        //store socket connection
        storeSocketInstanceWithUserId({ userId: user._id.toString(), socket: socket });
        // create channel with chatId
        const chatsByUserId = yield (0, chat_model_1.getChatsByUserId)(user._id);
        chatsByUserId === null || chatsByUserId === void 0 ? void 0 : chatsByUserId.forEach((ele) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, redis_pub_sub_1.createHasSet)({ name: "chats", key: ele._id.toString(), data: ele });
        }));
    }
    catch (error) {
        console.log('Something went wrong', error);
    }
});
const initializeSocketIO = (io) => {
    (0, redis_pub_sub_1.subscribeToChannel)({ channelName: constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT });
    (0, redis_pub_sub_1.subscribeToChannel)({ channelName: constants_1.ChatEventEnum.TYPING_EVENT });
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('New connection');
        socket.on('message', (res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = JSON.parse(res);
                if (data.event === constants_1.ChatEventEnum.CONNECTED_EVENT) {
                    yield authorizeEvent(socket, data);
                }
                else if (data.event === constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                    yield (0, redis_pub_sub_1.publishToChannel)({ channelName: constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT, data: data });
                }
                else if (data.event === constants_1.ChatEventEnum.TYPING_EVENT) {
                    yield (0, redis_pub_sub_1.publishToChannel)({ channelName: constants_1.ChatEventEnum.TYPING_EVENT, data: data });
                }
            }
            catch (error) {
                console.log('Error while handling message', error);
            }
        }));
        socket.on("error", (error) => {
            console.log("Socket error: ", error);
        });
        socket.on('close', (code, reason) => {
            console.log('Client disconnect', { code, reason });
            removeSocketInstanceWithUserId({ socket });
            // removeHasSet({name: "chats", key:user._id.toString()})
        });
    }));
    //--------------------listen message come from channel
    listenToChannel();
};
exports.initializeSocketIO = initializeSocketIO;
