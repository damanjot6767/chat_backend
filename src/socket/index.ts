import cookie from "cookie";
import jwt from "jsonwebtoken";
import WebSocket, { WebSocketServer } from "ws";
import { ChatEventEnum } from "../constants";
import { Request } from "express";
import { UserModel } from "../models/index";
import { ApiError } from "../utils/api-error";
import { ChatResponseDto, CreateChatDto } from "../controllers/chats/dto";
import { getChatsByUserId } from "../models/chat.model";
import { publishMessageWithChatIdToChannel, setSocketInstanceWithChatId, subscribeToChannelMessageWithChatId } from "../controllers/chats/chat-redis-service";

const conversationsObject = {};

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

        // create channel with chatId
        const chatsByUserId = await getChatsByUserId(user._id);

        chatsByUserId?.forEach(async(ele) => {
            await setSocketInstanceWithChatId(ele?._id.toString(), socket)
            await subscribeToChannelMessageWithChatId(ele._id.toString())
        });
    } catch (error) {
        console.log('Something went wrong', error);
    }
};

const initializeSocketIO = (io) => {
    io.on("connection", async (socket) => {
        console.log('New connection');

        socket.on('message', async (res) => {
            try {
                const data = JSON.parse(res);
                if (data.event === ChatEventEnum.CONNECTED_EVENT) {
                    await authorizeEvent(socket, data);
                    console.log('Connected: new user connected', io.clients.size);
                } else if (data.ievent === ChatEventEnum.JOIN_CHAT_EVENT) {
                    await setSocketInstanceWithChatId(data.chatId, socket)
                } else if (data.event === ChatEventEnum.MESSAGE_RECEIVED_EVENT) {
                    // conversationsObject[data.chatId]?.forEach((item) => {
                    //     if (item !== socket) {
                    //         item.send(JSON.stringify(data));
                    //     }
                    // });
                    await publishMessageWithChatIdToChannel({...data, socket})
                } else if (data.event === ChatEventEnum.TYPING_EVENT) {
                    await publishMessageWithChatIdToChannel({...data, socket})
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
            for (let chatId in conversationsObject) {
                let sockets = conversationsObject[chatId];
                sockets = sockets?.filter((item) => item !== socket);
                conversationsObject[chatId] = sockets;
            }
        });
    });
};

export { initializeSocketIO };