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
exports.getUserByEmailService = exports.changePasswordService = exports.generateTempraryToken = exports.handleSocialLoginService = exports.updateUserService = exports.getAllUsersService = exports.getUserService = exports.loginService = exports.registerService = void 0;
const api_error_1 = require("../../utils/api-error");
const index_1 = require("../../models/index");
const user_model_1 = require("../../models/user.model");
const registerService = (userCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserByEmail)(userCreateDto.email);
    if (user)
        throw new api_error_1.ApiError(400, 'User already exist');
    const userResponse = yield (0, user_model_1.createUser)(userCreateDto);
    const { accessToken } = yield generateAccessAndRefereshTokens(userResponse._id);
    const userDetails = yield (0, user_model_1.getUserById)(userResponse._id);
    userDetails.accessToken = accessToken;
    return userDetails;
});
exports.registerService = registerService;
const loginService = ({ password, email }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserByLoginCredential)(email, password);
    if (!user)
        throw new api_error_1.ApiError(400, 'Invalid Credentials');
    const { accessToken } = yield generateAccessAndRefereshTokens(user._id);
    user.accessToken = accessToken;
    return user;
});
exports.loginService = loginService;
const getUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserById)(id);
    return user;
});
exports.getUserService = getUserService;
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUsers)();
    return user;
});
exports.getAllUsersService = getAllUsersService;
const updateUserService = (id, updateUserDto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.updateUserById)(id, updateUserDto);
    return user;
});
exports.updateUserService = updateUserService;
const handleSocialLoginService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserById)(userId);
    if (!user) {
        throw new api_error_1.ApiError(404, "User does not exist");
    }
    const { accessToken } = yield generateAccessAndRefereshTokens(user._id);
    user["accessToken"] = accessToken;
    return user;
});
exports.handleSocialLoginService = handleSocialLoginService;
const generateAccessAndRefereshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findById(userId);
        const accessToken = user.generateAccessToken(user);
        const refreshToken = user.generateRefreshToken(user);
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new api_error_1.ApiError(500, "Something went wrong while generating referesh and access token");
    }
});
const generateTempraryToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.UserModel.findById(userId);
        const token = user.generateTempraryToken(user);
        return { token };
    }
    catch (error) {
        throw new api_error_1.ApiError(500, "Something went wrong while generating mail token");
    }
});
exports.generateTempraryToken = generateTempraryToken;
const changePasswordService = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.changePassword)(id, password);
    return user;
});
exports.changePasswordService = changePasswordService;
const getUserByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_model_1.getUserByEmail)(email);
    return user;
});
exports.getUserByEmailService = getUserByEmailService;
