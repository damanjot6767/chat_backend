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
exports.deleteMessage = exports.updateMessage = exports.createMessage = void 0;
const constants_1 = require("../../constants");
const socket_1 = require("../../socket");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const message_service_1 = require("./message-service");
const createMessage = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, message_service_1.createMessageService)(req.user, req.body);
    response.userIds.forEach((user) => {
        if (user.userId !== (req === null || req === void 0 ? void 0 : req.user._id)) {
            (0, socket_1.emitSocketEvent)(req, user.userId, constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT, response);
        }
    });
    return res.
        status(201).
        json(new api_response_1.ApiResponse(201, response, 'Message created successfully'));
}));
exports.createMessage = createMessage;
const updateMessage = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, message_service_1.updateMessageService)(req.params.id, req.body);
    return res.
        status(200).
        json(new api_response_1.ApiResponse(201, response, 'Message update successfully'));
}));
exports.updateMessage = updateMessage;
const deleteMessage = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, message_service_1.deleteMessageService)(req.user, req.params.id);
    return res.
        status(200).
        json(new api_response_1.ApiResponse(201, 'Message delete successfully'));
}));
exports.deleteMessage = deleteMessage;
