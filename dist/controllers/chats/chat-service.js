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
exports.deleteChatService = exports.updateChatService = exports.getChatByUserIdService = exports.getChatService = exports.createChatService = void 0;
const api_error_1 = require("../../utils/api-error");
const chat_model_1 = require("../../models/chat.model");
const user_model_1 = require("../../models/user.model");
const createChatService = (user, createChatDto) => __awaiter(void 0, void 0, void 0, function* () {
    const userIds = createChatDto.userIds.map((id) => {
        if (id.toString() !== user._id.toString()) {
            return { isChatDelete: false, userId: id };
        }
    });
    if (!createChatDto.userIds.length)
        throw new api_error_1.ApiError(400, 'Receiver user id must be different from main user');
    userIds.push({ isChatDelete: false, userId: user._id });
    for (const userObject of userIds) {
        yield (0, user_model_1.getUserById)(userObject.userId);
    }
    const chat = yield (0, chat_model_1.getChatByUserIds)(createChatDto.userIds);
    if (chat)
        throw new api_error_1.ApiError(400, 'Chat already exist');
    createChatDto.userIds = userIds;
    const chatResponse = yield (0, chat_model_1.createChat)(createChatDto);
    return chatResponse;
});
exports.createChatService = createChatService;
const getChatService = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatById)(id);
    return chat;
});
exports.getChatService = getChatService;
const getChatByUserIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatsByUserId)(id);
    return chat;
});
exports.getChatByUserIdService = getChatByUserIdService;
const updateChatService = (id, updateChatDto) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.updateChatById)(id, updateChatDto);
    return chat;
});
exports.updateChatService = updateChatService;
const deleteChatService = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield (0, chat_model_1.getChatById)(id);
    chat === null || chat === void 0 ? void 0 : chat.userIds.forEach((item) => {
        if ((item === null || item === void 0 ? void 0 : item.userId.toString()) === user._id.toString() && item.isChatDelete) {
            throw new api_error_1.ApiError(400, 'Chat already deleted by user');
        }
        if ((item === null || item === void 0 ? void 0 : item.userId.toString()) === user._id.toString()) {
            item.isChatDelete = true;
        }
        return item;
    });
    yield (0, chat_model_1.updateChatById)(id, { userIds: chat.userIds });
    return chat;
});
exports.deleteChatService = deleteChatService;
