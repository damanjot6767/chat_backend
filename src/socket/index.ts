import cookie from "cookie";
import jwt from "jsonwebtoken";
import WebSocket, { WebSocketServer } from "ws";
import { ChatEventEnum } from "../constants";
import { Request } from "express";
import { UserModel } from "../models/index";
import { ApiError } from "../utils/api-error";
import { ChatResponseDto, CreateChatDto } from "../controllers/chats/dto";
import { getChatsByUserId } from "../models/chat.model";
import { redisSubscriberInstance } from "../redis/redis";
import { createHasSet, getHasSet, publishToChannel, removeHasSet, subscribeToChannel } from "../redis/redis-pub-sub";
import { json } from "body-parser";
import { pushMessageRedis } from "../controllers/messages/message-redis-service";

const socketObject = {};

const storeSocketInstanceWithUserId = ({userId, socket}:{userId: string, socket:WebSocket})=>{
    if(!socketObject[userId]){
        socketObject[userId] = socket;
    }
    else{
        socketObject[userId] = socket;
    }
}
const removeSocketInstanceWithUserId = ({socket}:{socket:WebSocket})=>{
    for(let userId in socketObject)
    if(socketObject[userId]==socket){
        delete socketObject[userId];
    }
}
 
const listenToChannel = async () => {
    try {
        redisSubscriberInstance.on('message', async(channel, message) => {
            const data = JSON.parse(message);
            if(channel===ChatEventEnum.MESSAGE_RECEIVED_EVENT){
                const res = await pushMessageRedis(data.data)
                data.data = res;
                const sentBy = data.data.messageSentBy;
                const {userIds} = await getHasSet({name: "chats", key: data.data.chatId.toString()});
                userIds?.map(({userId})=>{
                    if(socketObject[userId]){
                        socketObject[userId].send(JSON.stringify(data))
                    }
                })
            }
            else if(channel===ChatEventEnum.TYPING_EVENT){
                const sentBy = data.data.messageSentBy;
                const {userIds} = await getHasSet({name: "chats", key: data.data.chatId.toString()});
                userIds?.map(({userId})=>{
                    if(userId!==sentBy && socketObject[userId]){
                        socketObject[userId].send(JSON.stringify(data))
                    }
                })
            }
          });
    } catch (error) {
        console.log('error',error)
        throw new ApiError(400, 'Something went wrong while subscribeToChannelWithChatId')
    }
}

const authorizeEvent = async (socket, data) => {
    try {
        let token = data?.token; // get the accessToken

        if (!token) {
            // If there is no access token in cookies. Check inside the handshake auth
            token = socket.handshake.query?.token;
        }

        if (!token) {
            // Token is required for the socket to work
            throw new ApiError(401, "Unauthorized handshake. Token is missing");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

        const user = await UserModel.findById(decodedToken).select("-password -refreshToken");

        // retrieve the user
        if (!user) {
            throw new ApiError(401, "Unauthorized handshake. Token is invalid");
        }

        //store socket connection
        storeSocketInstanceWithUserId({userId: user._id.toString(), socket: socket})

        // create channel with chatId
        const chatsByUserId = await getChatsByUserId(user._id);
        chatsByUserId?.forEach(async(ele)=>{
            await createHasSet({name: "chats", key:ele._id.toString(), data: ele})
        })
    } catch (error) {
        console.log('Something went wrong', error);
    }
};

const initializeSocketIO = (io) => {
    subscribeToChannel({channelName: ChatEventEnum.MESSAGE_RECEIVED_EVENT})
    subscribeToChannel({channelName: ChatEventEnum.TYPING_EVENT})
    io.on("connection", async (socket) => {
        console.log('New connection');

        socket.on('message', async (res) => {
            try {
                const data = JSON.parse(res);
                if (data.event === ChatEventEnum.CONNECTED_EVENT) {
                    await authorizeEvent(socket, data);
                } else if (data.event === ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                    await publishToChannel({channelName: ChatEventEnum.MESSAGE_RECEIVED_EVENT, data: data})
                } else if (data.event === ChatEventEnum.TYPING_EVENT) {
                    await publishToChannel({channelName: ChatEventEnum.TYPING_EVENT, data: data})
                }
            } catch (error) {
                console.log('Error while handling message', error);
            }
        });

        socket.on("error", (error) => {
            console.log("Socket error: ", error);
        });

        socket.on('close', (code, reason) => {
            console.log('Client disconnect', { code, reason });
            removeSocketInstanceWithUserId({socket})
            // removeHasSet({name: "chats", key:user._id.toString()})
        })
    });

    //--------------------listen message come from channel
    listenToChannel()
};

export { initializeSocketIO };