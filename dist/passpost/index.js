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
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const api_error_1 = require("../utils/api-error");
const user_model_1 = require("../models/user.model");
const constants_1 = require("../constants");
try {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, (_, __, profile, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const user = yield (0, user_model_1.getUserByEmail)(profile._json.email);
        if (user) {
            if (user.loginType !== constants_1.UserLoginType.GOOGLE) {
                next(new api_error_1.ApiError(400, "You have previously registered using " +
                    ((_b = (_a = user.loginType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.split("_").join(" ")) +
                    ". Please use the " +
                    ((_d = (_c = user.loginType) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.split("_").join(" ")) +
                    " login option to access your account."), null);
            }
            else {
                next(null, user);
            }
        }
        else {
            const createdUser = yield (0, user_model_1.createUser)({
                email: profile._json.email,
                fullName: profile._json.name,
                password: profile._json.sub,
                isEmailVerified: true,
                avatar: profile._json.picture,
                loginType: constants_1.UserLoginType.GOOGLE
            });
            if (createdUser) {
                next(null, createdUser);
            }
            else {
                next(new api_error_1.ApiError(500, "Error while registering the user"), null);
            }
        }
    })));
}
catch (error) {
    console.error("PASSPORT ERROR: ", error);
}
