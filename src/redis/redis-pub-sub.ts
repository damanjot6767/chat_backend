import { ApiError } from "../utils/api-error";
import { redisInstance, redisPublishInstance, redisSubscriberInstance } from "./redis";

export const createHasSet = async({ name, key, data }:{name: string, key: string, data: any}) => {
    try {
        const res = await redisInstance.hset(name, key ,JSON.stringify(data))
        console.log("has set created", res)
    } catch (error) {
        console.log('error hast set created', error)
    }
}

export const getHasSet = async({ name, key}:{name: string, key: string}) => {
    try {
        const res = await redisInstance.hget(name, key )
        console.log("has set get", res)
        return JSON.parse(res)
    } catch (error) {
        console.log('error has set get', error)
    }
}

export const removeHasSet = async({ name, key}:{name: string, key: string}) => {
    try {
        const res = await redisInstance.hdel(name, key )
        console.log("has set removed", res)
    } catch (error) {
        console.log('error has set removed', error)
    }
}



export const publishToChannel = async ({ channelName, data }: { channelName: string, data: any }): Promise<any> => {
    try {
        const res = await redisPublishInstance.publish(channelName, JSON.stringify(data))
        console.log("res")
    } catch (error) {
        console.log('error', error)
        throw new ApiError(400, 'Something went wrong while publishMessageWithChatIdToChannel')
    }
}

export const subscribeToChannel = async ({ channelName }: { channelName: string }) => {
    try {
        const res = await redisSubscriberInstance.subscribe(channelName)
        // redisSubscriberInstance.on('message', async(channel, message) => {
        //     const data = JSON.parse(message);
        //     const sockets = await getSocketInstanceWithChatId(channel);
        //     sockets.forEach((item)=>{
        //         if(item!==data.socket){
        //             data.socket?.send(JSON.stringify(data))
        //         }
        //     });
        //   });
    } catch (error) {
        console.log('error', error)
        throw new ApiError(400, 'Something went wrong while subscribeToChannelWithChatId')
    }
}
