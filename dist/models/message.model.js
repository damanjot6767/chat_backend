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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageById = exports.deleteMessageById = exports.createMessage = exports.getMessageById = exports.MessageModel = exports.messageSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const api_error_1 = require("../utils/api-error");
exports.messageSchema = new mongoose_1.Schema({
    body: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    file: {
        type: String,
        default: null
    },
    messageSentBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users"
    },
    userIds: [
        {
            isMessageDelete: {
                type: Boolean,
                default: false
            },
            isMessageSeen: {
                type: Boolean,
                default: false
            },
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Users"
            }
        }
    ],
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chats"
    }
}, {
    timestamps: true
});
exports.MessageModel = mongoose_1.default.model('Messages', exports.messageSchema);
// Message Services
// export const getMessageById = async (id: string): Promise<ChatResponseDto> => {
//     try {
//         const chat: any = await MessageModel.aggregate([
//             {
//                 $match: {
//                     _id: new mongoose.Types.ObjectId(id)
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     let: {
//                         userId: "$userIds.userId"
//                     },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $in: [
//                                         "$_id",
//                                         "$$userId"
//                                     ]
//                                 }
//                             }
//                         }
//                     ],
//                     as: "users"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'messages',
//                     let: {
//                         messageIds: "$messageIds"
//                     },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $in: [
//                                         "$_id",
//                                         "$$messageIds"
//                                     ]
//                                 }
//                             }
//                         }
//                     ],
//                     as: "messages"
//                 }
//             },
//             {
//                 $project: {
//                     "users.password": 0,
//                     "users.refreshToken": 0
//                 }
//             }
//         ]);
//         if (!chat.length) throw new ApiError(401, 'Chat not found ')
//         return chat[0]
//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while finding chat by id")
//     }
// }
const getMessageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield exports.MessageModel.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        userId: "$userIds.userId"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        "$$userId"
                                    ]
                                }
                            }
                        }
                    ],
                    as: "users"
                }
            },
            {
                $project: {
                    "users.password": 0,
                    "users.refreshToken": 0
                }
            }
        ]);
        if (!message.length)
            throw new api_error_1.ApiError(401, 'Message not found ');
        return message[0];
    }
    catch (error) {
        throw new api_error_1.ApiError(500, "Something went wrong while finding chat by id");
    }
});
exports.getMessageById = getMessageById;
const createMessage = (values) => exports.MessageModel.create(values);
exports.createMessage = createMessage;
const deleteMessageById = (id) => exports.MessageModel.findOneAndDelete({ _id: id });
exports.deleteMessageById = deleteMessageById;
const updateMessageById = (id, values) => exports.MessageModel.findByIdAndUpdate(id, values, { new: true });
exports.updateMessageById = updateMessageById;
