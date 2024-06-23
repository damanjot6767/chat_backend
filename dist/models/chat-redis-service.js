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
exports.getChatByIdRedis = exports.setChatByIdRedis = void 0;
const redis_1 = require("../redis/redis");
const api_error_1 = require("../utils/api-error");
const setChatByIdRedis = (chatPayload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield redis_1.redisInstance.set("chat" + chatPayload._id, JSON.stringify(chatPayload), 'EX', 300);
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while seting chat in redis');
    }
});
exports.setChatByIdRedis = setChatByIdRedis;
const getChatByIdRedis = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.get("chat" + chatId);
        const chat = JSON.parse(res);
        return chat;
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while pulling message');
    }
});
exports.getChatByIdRedis = getChatByIdRedis;
// export const deleteMessagesRedis = async (chatId): Promise<any> => {
//     try {
//         const res =  await redisInstance.del(chatId)
//         return res
//     } catch (error) {
//         console.log('error',error)
//         throw new ApiError(400, 'Something went wrong while deleting messages')
//     }
// }
