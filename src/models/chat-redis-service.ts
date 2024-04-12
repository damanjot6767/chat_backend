import { ChatResponseDto } from "../controllers/chats/dto";
import { redisInstance } from "../redis/redis";
import { ApiError } from "../utils/api-error";


export const setChatByIdRedis = async (chatPayload: ChatResponseDto): Promise<any> => {
    try {
        return await redisInstance.set("chat"+chatPayload._id, JSON.stringify(chatPayload), 'EX', 300)

    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while seting chat in redis')
    }
}


export const getChatByIdRedis = async (chatId): Promise<any> => {
    try {
        const res =  await redisInstance.get("chat"+chatId)
        const chat = JSON.parse(res);
        return chat
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while pulling message')
    }
}


// export const deleteMessagesRedis = async (chatId): Promise<any> => {
//     try {
//         const res =  await redisInstance.del(chatId)
//         return res
//     } catch (error) {
//         console.log('error',error)
//         throw new ApiError(400, 'Something went wrong while deleting messages')
//     }
// }