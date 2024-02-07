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
exports.changePassword = exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserByLoginCredential = exports.getUserByEmail = exports.getUsers = exports.UserModel = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_error_1 = require("../utils/api-error");
const constants_1 = require("../constants");
exports.userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
    },
    coverImage: {
        type: String, // cloudinary url
    },
    loginType: {
        type: String,
        enum: Object.values(constants_1.UserLoginType),
        default: constants_1.UserLoginType.EMAIL_PASSWORD
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String,
        select: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    conversationId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Chats"
        }
    ],
    messageId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Messages"
        }
    ],
}, {
    timestamps: true
});
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
exports.userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken_1.default.sign(Object.assign({}, this._doc), process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};
exports.userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign(Object.assign({}, this._doc), process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};
exports.userSchema.methods.generateTempraryToken = function () {
    return jsonwebtoken_1.default.sign(Object.assign({}, this._doc), process.env.TEMPRARY_TOKEN_SECRET, {
        expiresIn: process.env.TEMPRARY_TOKEN_EXPIRY
    });
};
exports.UserModel = mongoose_1.default.model('User', exports.userSchema);
// User Services
const getUsers = () => exports.UserModel.find();
exports.getUsers = getUsers;
const getUserByEmail = (email) => exports.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserByLoginCredential = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield exports.UserModel.findOne({ email }).select('+password');
        const isPasswordValid = yield user.isPasswordCorrect(password);
        if (!isPasswordValid)
            throw new api_error_1.ApiError(400, 'Invalis credentials');
        delete user._doc.password; //exclude delete key from doc object
        return user._doc;
    }
    catch (error) {
        throw new api_error_1.ApiError(400, error.message);
    }
});
exports.getUserByLoginCredential = getUserByLoginCredential;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield exports.UserModel.findOne({ _id: id });
        if (user) {
            return user;
        }
        throw new api_error_1.ApiError(401, 'User not found');
    }
    catch (error) {
        throw new api_error_1.ApiError(500, "Something went wrong while finding user by id");
    }
});
exports.getUserById = getUserById;
const createUser = (values) => exports.UserModel.create(values);
exports.createUser = createUser;
const deleteUserById = (id) => exports.UserModel.findOneAndDelete({ _id: id });
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => exports.UserModel.findByIdAndUpdate(id, values, { new: true });
exports.updateUserById = updateUserById;
const changePassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        newPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const user = yield exports.UserModel.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
        return user;
    }
    catch (error) {
        throw new api_error_1.ApiError(400, error.message);
    }
});
exports.changePassword = changePassword;
