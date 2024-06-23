"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = exports.chatRouter = exports.userRouter = void 0;
const user_route_1 = __importDefault(require("./user-route"));
exports.userRouter = user_route_1.default;
const chat_route_1 = __importDefault(require("./chat-route"));
exports.chatRouter = chat_route_1.default;
const message_route_1 = __importDefault(require("./message-route"));
exports.messageRouter = message_route_1.default;
