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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessagesRedis = exports.pullMessageRedis = exports.pushMessageRedis = exports.createDummyMessage = void 0;
const message_model_1 = require("../../models/message.model");
const redis_1 = require("../../redis/redis");
const api_error_1 = require("../../utils/api-error");
const generate_mongo_id_1 = require("../../utils/generate-mongo-id");
const createDummyMessage = (payload) => {
    const new_payload = Object.assign({}, payload);
    new_payload['_id'] = (0, generate_mongo_id_1.generateMongooseID)();
    new_payload['createdAt'] = new Date();
    new_payload['updatedAt'] = new Date();
    return new_payload;
};
exports.createDummyMessage = createDummyMessage;
const pushMessageRedis = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const new_payload = (0, exports.createDummyMessage)(payload);
        yield redis_1.redisInstance.rpush(payload.chatId, JSON.stringify(new_payload));
        const isCacheMessages = yield (0, exports.pullMessageRedis)(payload === null || payload === void 0 ? void 0 : payload.chatId);
        if ((isCacheMessages === null || isCacheMessages === void 0 ? void 0 : isCacheMessages.length) >= 100) {
            const response = yield (0, message_model_1.createManyMessage)(isCacheMessages);
            yield (0, exports.deleteMessagesRedis)(payload === null || payload === void 0 ? void 0 : payload.chatId);
        }
        return new_payload;
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while creating message');
    }
});
exports.pushMessageRedis = pushMessageRedis;
const pullMessageRedis = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.lrange(chatId, 0, -1);
        const messages = res.map(serializedMessage => JSON.parse(serializedMessage));
        return messages;
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while pulling message');
    }
});
exports.pullMessageRedis = pullMessageRedis;
const deleteMessagesRedis = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.del(chatId);
        return res;
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while deleting messages');
    }
});
exports.deleteMessagesRedis = deleteMessagesRedis;
