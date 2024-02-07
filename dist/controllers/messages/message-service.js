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
exports.deleteMessageService = exports.updateMessageService = exports.createMessageService = void 0;
const chat_model_1 = require("../../models/chat.model");
const message_model_1 = require("../../models/message.model");
const api_error_1 = require("../../utils/api-error");
const createMessageService = (user, createMessageDto) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatById)(createMessageDto.chatId);
    const userIds = chat.userIds.map((item) => ({ isMessageDelete: false, userId: item.userId }));
    createMessageDto.userIds = userIds;
    createMessageDto.messageSentBy = user._id;
    const messageResponse = yield (0, message_model_1.createMessage)(createMessageDto);
    chat.messageIds.push(messageResponse._id);
    yield (0, chat_model_1.updateChatById)(chat._id, { messageIds: chat.messageIds });
    return messageResponse;
});
exports.createMessageService = createMessageService;
const updateMessageService = (id, updateMessageDto) => __awaiter(void 0, void 0, void 0, function* () {
    const isMessageExist = yield (0, message_model_1.getMessageById)(id);
    if (!isMessageExist)
        throw new api_error_1.ApiError(400, 'Invalid Message id');
    const message = yield (0, message_model_1.updateMessageById)(id, updateMessageDto);
    return message;
});
exports.updateMessageService = updateMessageService;
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
