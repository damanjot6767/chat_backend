import mongoose, { Schema, Document, Types } from 'mongoose';
import { ChatType } from '../constants';
import { ChatResponseDto, CreateChatResponseDto } from '../controllers/chats/dto';
import { boolean, string } from 'joi';
import { ApiError } from '../utils/api-error';
import { getChatByIdRedis, setChatByIdRedis } from './chat-redis-service';



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
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Users"
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
            ref: "Messages",
            default: null
        }
    },
    {
        timestamps: true
    }
)

export const ChatModel = mongoose.model('Chat', chatSchema);


// Chat Services
export const getAggregationChatsByUserId =
    async (
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ChatResponseDto[]> => {
        try {
            const chat: any = await ChatModel.aggregate([
                {
                    $match: {
                        userIds: {
                            $elemMatch: { userId: new mongoose.Types.ObjectId(userId) }
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
                }
            ]);

            return chat
        } catch (error) {
            throw new ApiError(500, "Something went wrong while finding chats by user id")
        }
    }
export const getChatsByUserId = async ( userId: string, page: number = 1, limit: number = 10): Promise<ChatResponseDto[]> => {
    try {
        const chat: any = await ChatModel.find({
            userIds: {
                $elemMatch: { userId: new mongoose.Types.ObjectId(userId) }
            }
        });

        return chat
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chats by user id")
    }
}

export const getAggregationChatById = async (id: string): Promise<ChatResponseDto> => {
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
        const chat: any = await ChatModel.aggregate([
            {
                $match: {
                    userIds: {
                        $all: userIds.map(userId => ({ $elemMatch: { userId: new mongoose.Types.ObjectId(userId) } }))
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
            }
        ]);
        return chat
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
}
export const getChatById = async (id: string): Promise<any> => {
    try {
        const isCache = await getChatByIdRedis(id); 
        if(isCache) return isCache;

        const response =  await ChatModel.findOne({ _id: id })
        await setChatByIdRedis(response)
        return response
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
};
export const createChat = <ChatPayload>(values: ChatPayload): Promise<CreateChatResponseDto> => ChatModel.create(values);
export const deleteChatById = (id: string): any => ChatModel.findOneAndDelete({ _id: id });
export const updateChatById = <ChatPayload>(id: string, values: ChatPayload): Promise<CreateChatResponseDto> => ChatModel.findByIdAndUpdate(id, values, { new: true });


