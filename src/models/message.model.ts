import mongoose, { Schema, Document, Types } from 'mongoose';
import { ApiError } from '../utils/api-error';
import { CreateMessageDto, CreateMessageResponseDto } from '../controllers/messages/dto/create-message-dto';
import { MessageResponseDto } from '../controllers/messages/dto/message-dto';
import { deleteMessagesRedis, pullMessageRedis, pushMessageRedis } from '../controllers/messages/message-redis-service';



export const messageSchema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
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
                    type: Schema.Types.ObjectId,
                    ref: "Users"
                }
            }
        ],
        chatId:
        {
            type: Schema.Types.ObjectId,
            ref: "Chats"
        }
    },
    {
        timestamps: true
    }
)

// messageSchema.pre("insertMany", async function (next) {
//     this._id
// })

export const MessageModel = mongoose.model('Messages', messageSchema);


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

export const getMessageById = async (id: string): Promise<MessageResponseDto> => {
    try {
        const message: any = await MessageModel.aggregate([
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
                $project: {
                    "users.password": 0,
                    "users.refreshToken": 0
                }
            }
        ]);

        if (!message.length) throw new ApiError(401, 'Message not found ')
        return message[0]
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
}

export const getMessagesByChatId = async (id: string, page: number = 1, limit: number = 10): Promise<MessageResponseDto[]> => {
    try {
        const isCacheMessages = await pullMessageRedis(id);
        if(isCacheMessages?.length>=100) return isCacheMessages;
        limit=100-isCacheMessages?.length
        const message: any = await MessageModel.aggregate([
            {
                $match: {
                    chatId: new mongoose.Types.ObjectId(id)
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
            },
            {
                $skip: (page - 1) * limit // Skip documents based on the current page
            },
            {
                $limit: limit // Limit the number of documents per page
            }
        ]);

        return message
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding chat by id")
    }
}

export const createManyMessage = async (payload: CreateMessageDto): Promise<any> => {
    try {
       
            const response = await MessageModel.insertMany(payload);
            return response
        }
    catch (error) {
        throw new ApiError(500, "Something went wrong while create messages")
    }
}

export const createMessage = <MesssagePayload>(values: MesssagePayload): Promise<CreateMessageResponseDto> => MessageModel.create(values);

export const deleteMessageById = (id: string): any => MessageModel.findOneAndDelete({ _id: id });
export const updateMessageById = <MesssagePayload>(id: string, values: MesssagePayload): Promise<CreateMessageResponseDto> => MessageModel.findByIdAndUpdate(id, values, { new: true });


