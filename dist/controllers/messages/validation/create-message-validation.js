"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createMessageJoiValidationObject = exports.CreateMessageJoiValidation = void 0;
const Joi = __importStar(require("joi"));
const async_handler_1 = require("../../../utils/async-handler");
const api_error_1 = require("../../../utils/api-error");
const mongoose_1 = __importDefault(require("mongoose"));
const createMessageJoiValidationObject = Joi.object({
    body: Joi.string().allow(null),
    image: Joi.string().allow(null),
    file: Joi.string().allow(null),
    video: Joi.string().allow(null),
    chatId: Joi.string().required().custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error('id must be mongoose id');
        }
        return new mongoose_1.default.Types.ObjectId(value);
        ;
    }),
    userIds: Joi.array().items(Joi.string().required().custom((value, helpers) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            return helpers.error('id must be mongoose id');
        }
        return new mongoose_1.default.Types.ObjectId(value);
        ;
    }))
}).or('body', 'image', 'file', 'video').required();
exports.createMessageJoiValidationObject = createMessageJoiValidationObject;
const CreateMessageJoiValidation = (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = createMessageJoiValidationObject.validate(req.body);
    if (error) {
        throw new api_error_1.ApiError(400, error.message);
    }
    next();
}));
exports.CreateMessageJoiValidation = CreateMessageJoiValidation;
