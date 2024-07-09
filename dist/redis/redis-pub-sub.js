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
exports.subscribeToChannel = exports.publishToChannel = exports.removeHasSet = exports.getHasSet = exports.createHasSet = void 0;
const api_error_1 = require("../utils/api-error");
const redis_1 = require("./redis");
const createHasSet = ({ name, key, data }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.hset(name, key, JSON.stringify(data));
        console.log("has set created", res);
    }
    catch (error) {
        console.log('error hast set created', error);
    }
});
exports.createHasSet = createHasSet;
const getHasSet = ({ name, key }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.hget(name, key);
        console.log("has set get", res);
        return JSON.parse(res);
    }
    catch (error) {
        console.log('error has set get', error);
    }
});
exports.getHasSet = getHasSet;
const removeHasSet = ({ name, key }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisInstance.hdel(name, key);
        console.log("has set removed", res);
    }
    catch (error) {
        console.log('error has set removed', error);
    }
});
exports.removeHasSet = removeHasSet;
const publishToChannel = ({ channelName, data }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisPublishInstance.publish(channelName, JSON.stringify(data));
        console.log("res");
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while publishMessageWithChatIdToChannel');
    }
});
exports.publishToChannel = publishToChannel;
const subscribeToChannel = ({ channelName }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield redis_1.redisSubscriberInstance.subscribe(channelName);
        // redisSubscriberInstance.on('message', async(channel, message) => {
        //     const data = JSON.parse(message);
        //     const sockets = await getSocketInstanceWithChatId(channel);
        //     sockets.forEach((item)=>{
        //         if(item!==data.socket){
        //             data.socket?.send(JSON.stringify(data))
        //         }
        //     });
        //   });
    }
    catch (error) {
        console.log('error', error);
        throw new api_error_1.ApiError(400, 'Something went wrong while subscribeToChannelWithChatId');
    }
});
exports.subscribeToChannel = subscribeToChannel;
