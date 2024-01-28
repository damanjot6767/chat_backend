import mongoose, { Schema, Document, Types } from 'mongoose';
import { ChatType } from '../constants';
import { ChatResponseDto, CreateChatResponseDto } from '../controllers/chats/dto';
import { boolean, string } from 'joi';
import { ApiError } from '../utils/api-error';



export const chatSchema = new Schema(
    {
        name: {
            type: String,
        },
        chatType: {
            type: String,
            enum: Object.values(ChatType),
            default: ChatType.INDIVIDUAL
        },
        userIds: [
            {
                isChatDelete: {
                    type: Boolean,
                    default: false
                },
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "Users"
                }
            }
        ],
        messageIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Messages"
            }
        ],
        latestMessage:
        {
            type: Schema.Types.ObjectId,
            ref: "Messages"
        }
    },
    {
        timestamps: true
    }
)

export const ChatModel = mongoose.model('Chat', chatSchema);


// Chat Services
export const getChatsByUserId =
    (
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ChatResponseDto[]> =>
        ChatModel.aggregate([
            {
                $match: {
                    userIds: {
                        $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) }
                    }
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
                $lookup: {
                    from: 'messages',
                    let: {
                        messageIds: "$messageIds"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        "$$messageIds"
                                    ]
                                }
                            }
                        }
                    ],
                    as: "messages"
                }
            },
            {
                $project: {
                    "users.password": 0,
                    "users.refreshToken": 0
                }
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit
            },
            {
                $addFields: {
                    totalCount: limit,
                    page: page,
                    limit: limit
                }
            }
        ]);


export const getChatById = async (id: string): Promise<ChatResponseDto> => {
    try {
        const chat: any = await ChatModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
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
                $lookup: {
                    from: 'messages',
                    let: {
                        messageIds: "$messageIds"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        "$$messageIds"
                                    ]
                                }
                            }
                        }
                    ],
                    as: "messages"
                }
            },
            {
                $project: {
                    "users.password": 0,
                    "users.refreshToken": 0
                }
            }
        ]);

        if (!chat.length) throw new ApiError(401, 'Chat not found ')
        return chat[0]
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
}

export const getChatByUserIds = async (userIds: string[]): Promise<any> => {
    try {
        const chat: any = await ChatModel.findOne({
            userIds: {
                $all: userIds.map(userId => ({ $elemMatch: { userId } }))
            }
        });
        return chat
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
}

export const createChat = <ChatPayload>(values: ChatPayload): Promise<CreateChatResponseDto> => ChatModel.create(values);
export const deleteChatById = (id: string): any => ChatModel.findOneAndDelete({ _id: id });
export const updateChatById = <ChatPayload>(id: string, values: ChatPayload): Promise<CreateChatResponseDto> => ChatModel.findByIdAndUpdate(id, values, { new: true });


