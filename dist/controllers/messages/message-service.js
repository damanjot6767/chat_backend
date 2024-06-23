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
exports.deleteMessageService = exports.getMessagesByChatIdService = exports.updateMessageService = exports.createMultipleMessagesService = exports.createMessageService = void 0;
const chat_model_1 = require("../../models/chat.model");
const message_model_1 = require("../../models/message.model");
const api_error_1 = require("../../utils/api-error");
const createMessageService = (user, createMessageDto) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getAggregationChatById)(createMessageDto.chatId);
    const userIds = chat.userIds.map((item) => ({ isMessageDelete: false, userId: item.userId }));
    createMessageDto.userIds = userIds;
    createMessageDto.messageSentBy = user._id;
    let messageResponse = yield (0, message_model_1.createMessage)(createMessageDto);
    chat.messageIds.push(messageResponse._id);
    yield (0, chat_model_1.updateChatById)(chat._id, { messageIds: chat.messageIds });
    messageResponse = yield (0, message_model_1.getMessageById)(messageResponse._id);
    return messageResponse;
});
exports.createMessageService = createMessageService;
const createMultipleMessagesService = (user, createMessageDto) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatById)(createMessageDto === null || createMessageDto === void 0 ? void 0 : createMessageDto.chatId);
    const userIds = chat.userIds.map((item) => ({ isMessageDelete: false, userId: item.userId }));
    createMessageDto.userIds = userIds;
    createMessageDto.messageSentBy = user._id;
    let messageResponse = yield (0, message_model_1.createManyMessage)(createMessageDto);
    if (messageResponse === null || messageResponse === void 0 ? void 0 : messageResponse.length) {
        messageResponse.forEach((ele) => {
            chat.messageIds.push(ele._id);
        });
        yield (0, chat_model_1.updateChatById)(chat._id, { messageIds: chat.messageIds });
        messageResponse = yield (0, message_model_1.getMessageById)(messageResponse[(messageResponse === null || messageResponse === void 0 ? void 0 : messageResponse.length) - 1]._id);
    }
    return messageResponse;
});
exports.createMultipleMessagesService = createMultipleMessagesService;
const updateMessageService = (id, updateMessageDto) => __awaiter(void 0, void 0, void 0, function* () {
    const isMessageExist = yield (0, message_model_1.getMessageById)(id);
    if (!isMessageExist)
        throw new api_error_1.ApiError(400, 'Invalid Message id');
    const message = yield (0, message_model_1.updateMessageById)(id, updateMessageDto);
    return message;
});
exports.updateMessageService = updateMessageService;
const getMessagesByChatIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatById)(id);
    if (!chat)
        throw new api_error_1.ApiError(400, 'Invalid Chat id');
    const messages = yield (0, message_model_1.getMessagesByChatId)(id);
    return messages;
});
exports.getMessagesByChatIdService = getMessagesByChatIdService;
const deleteMessageService = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, message_model_1.getMessageById)(id);
    message === null || message === void 0 ? void 0 : message.userIds.forEach((item) => {
        if ((item === null || item === void 0 ? void 0 : item.userId.toString()) === user._id.toString() && item.isMessageDelete) {
            throw new api_error_1.ApiError(400, 'Message already deleted by user');
        }
        if ((item === null || item === void 0 ? void 0 : item.userId.toString()) === user._id.toString()) {
            item.isMessageDelete = true;
        }
        return item;
    });
    const updatedMessage = yield (0, message_model_1.updateMessageById)(id, { userIds: message.userIds });
    return updatedMessage;
});
exports.deleteMessageService = deleteMessageService;
