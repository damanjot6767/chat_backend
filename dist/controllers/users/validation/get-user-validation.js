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
exports.GetUserByIdParamJoiValidation = exports.getUserByIdParamJoiValidationObject = void 0;
const joi_1 = __importDefault(require("joi"));
const async_handler_1 = require("../../../utils/async-handler");
const api_error_1 = require("../../../utils/api-error");
exports.getUserByIdParamJoiValidationObject = joi_1.default.object({
    userId: joi_1.default.string().optional()
});
exports.GetUserByIdParamJoiValidation = (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = exports.getUserByIdParamJoiValidationObject.validate(req.params);
    if (error) {
        throw new api_error_1.ApiError(400, error.message);
    }
    next();
}));
