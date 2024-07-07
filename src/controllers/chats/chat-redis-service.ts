import { redisInstance, redisSubscriberInstance, Redis, redisPublishInstance } from "../../redis/redis";
import { ApiError } from "../../utils/api-error";
import { generateMongooseID } from "../../utils/generate-mongo-id";

export const pushMessageRedis = async (payload:any): Promise<any> => {
    try {
        const new_payload = {...payload} ;
        new_payload['_id'] = generateMongooseID();
        new_payload['createdAt'] = new Date();
        new_payload['updatedAt'] = new Date();

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

// create chat conversation object with hset
export const setSocketInstanceWithChatId = async (key: string, socket: Redis): Promise<any> => {
    try {
        let isExit = await redisInstance.get(key+"socket");
        if(isExit){
            isExit= JSON.parse(isExit);
            const sockets = JSON.stringify([...isExit,socket]);
            const res = await redisInstance.set(key+"socket", sockets);
        }

        else{
            const res = await redisInstance.set(key+"socket",JSON.stringify([socket]));
        }
        
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while setSocketInstanceWithChatId')
    }
}

// update chat conversation object with hset
export const updateSocketInstanceWithChatId = async (key: string, socket: Redis): Promise<any> => {
    try {
        const isExit = JSON.parse(await redisInstance.get(key+"socket"));
        if(isExit){
            const sockets = JSON.stringify([...isExit,socket]);
            const res = await redisInstance.set(key+"socket", sockets);
        }
        
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while updateSocketInstanceWithChatId')
    }
}

export const getSocketInstanceWithChatId = async (key: string): Promise<any> => {
    try {
        const isExit = JSON.parse(await redisInstance.get(key+"socket"));
        if(isExit) return isExit;
        throw new ApiError(400, 'Something went wrong while getSocketInstanceWithChatId')
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while setSocketInstanceWithChatId')
    }
}


export const publishMessageWithChatIdToChannel = async (data: any): Promise<any> => {
    try {
        const res = await redisPublishInstance.publish(data.chatId+"socket", JSON.stringify(data))
        console.log("res")
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while publishMessageWithChatIdToChannel')
    }
}

export const subscribeToChannelMessageWithChatId = async (name: string) => {
    try {
        const res = await redisSubscriberInstance.subscribe(name+"socket")
        redisSubscriberInstance.on('message', async(channel, message) => {
            const data = JSON.parse(message);
            const sockets = await getSocketInstanceWithChatId(channel);
            sockets.forEach((item)=>{
                if(item!==data.socket){
                    data.socket?.send(JSON.stringify(data))
                }
            });
          });
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while subscribeToChannelMessageWithChatId')
    }
}