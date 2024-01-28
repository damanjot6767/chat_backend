import mongoose, { Schema, Document, Types } from 'mongoose';
import { ApiError } from '../utils/api-error';
import { CreateMessageResponseDto } from '../controllers/messages/dto/create-message-dto';
import { MessageResponseDto } from '../controllers/messages/dto/message-dto';



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

export const createMessage = <MesssagePayload>(values: MesssagePayload): Promise<CreateMessageResponseDto> => MessageModel.create(values);
export const deleteMessageById = (id: string): any => MessageModel.findOneAndDelete({ _id: id });
export const updateMessageById = <MesssagePayload>(id: string, values: MesssagePayload): Promise<CreateMessageResponseDto> => MessageModel.findByIdAndUpdate(id, values, { new: true });


