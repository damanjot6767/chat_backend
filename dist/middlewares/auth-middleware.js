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
exports.verifyMailJWT = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_1 = require("../utils/api-error");
const async_handler_1 = require("../utils/async-handler");
const user_model_1 = require("../models/user.model");
const verifyJWT = (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_c = (_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c[1]);
    if (!token) {
        throw new api_error_1.ApiError(401, 'Unauthorized request');
    }
    const decodeToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = yield (0, user_model_1.getUserById)(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken._id);
    req.user = user._doc;
    next();
}));
exports.verifyJWT = verifyJWT;
const verifyMailJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        if (!token) {
            throw new api_error_1.ApiError(401, 'Unauthorized request');
        }
        const decodeToken = jsonwebtoken_1.default.verify(token, process.env.TEMPRARY_TOKEN_SECRET);
        const user = yield (0, user_model_1.getUserById)(decodeToken === null || decodeToken === void 0 ? void 0 : decodeToken._id);
        req.user = user._doc;
        next();
    }
    catch (error) {
        res.render('mail-confirmation-expired', {
            error: error.message === 'jwt expired'
                ? 'Token Expired' :
                error.message
        });
    }
});
exports.verifyMailJWT = verifyMailJWT;
