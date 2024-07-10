import { createManyMessage } from "../../models/message.model";
import { redisInstance } from "../../redis/redis";
import { ApiError } from "../../utils/api-error";
import { generateMongooseID } from "../../utils/generate-mongo-id";

export const createDummyMessage = (payload: any)=>{
        const new_payload = {...payload} ;
        new_payload['_id'] = generateMongooseID();
        new_payload['createdAt'] = new Date();
        new_payload['updatedAt'] = new Date();

        return new_payload
}

export const pushMessageRedis = async (payload:any): Promise<any> => {
    try {
        const new_payload = createDummyMessage(payload)
        await redisInstance.rpush(payload.chatId, JSON.stringify(new_payload))
        return new_payload
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while creating message')
    }
}


export const pullMessageRedis = async (chatId): Promise<any> => {
    try {
        const res =  await redisInstance.lrange(chatId, 0, -1)
        const messages = res.map(serializedMessage => JSON.parse(serializedMessage));
        return messages
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while pulling message')
    }
}


export const deleteMessagesRedis = async (chatId): Promise<any> => {
    try {
        const res =  await redisInstance.del(chatId)
        return res
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while deleting messages')
    }
}