import cookie from "cookie";
import jwt from "jsonwebtoken";
import WebSocket, { WebSocketServer} from "ws";
import { ChatEventEnum } from "../constants";
import { Request } from "express";
import { UserModel } from "../models/index";
import { ApiError } from "../utils/api-error";;
import { ChatResponseDto, CreateChatDto } from "../controllers/chats/dto";


const conversationsObject = {}

const authorizeEvent = async(socket: any, data: any)=>{
           try {
            let token:any = data?.token; // get the accessToken

            if (!token) {
                // If there is no access token in cookies. Check inside the handshake auth
                token = socket.handshake.query?.token
            }

            if (!token) {
                // Token is required for the socket to work
                throw new ApiError(401, "Un-authorized handshake. Token is missing");
            }

            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // decode the token

            const user = await UserModel.findById(decodedToken).select(
                "-password -refreshToken "
            );

            // retrieve the user
            if (!user) {
                throw new ApiError(401, "Un-authorized handshake. Token is invalid");
            }
            socket.user = user; // mount te user object to the socket
           } catch (error) {
             socket
           }
}

const initializeSocketIO = (io: WebSocketServer) => {
    return io.on("connection", async (socket: WebSocketServer) => {

            socket.on('message', async(res)=>{
                try {
                    const data = JSON.parse(res);
                    if(data.event===ChatEventEnum.CONNECTED_EVENT){
                        await authorizeEvent(socket,data)
                        console.log('connected','new user connected ');
                    }

                    else if(data.event===ChatEventEnum.JOIN_CHAT_EVENT){
                        if(conversationsObject[data.chatId]){
                            const sockets = [...conversationsObject[data.chatId],socket]
                            conversationsObject[data.chatId]=sockets

                        }
                        else{
                            conversationsObject[data.chatId]=[socket];
                        }
                    }

                    else if(data.event===ChatEventEnum.MESSAGE_RECEIVED_EVENT){
                        conversationsObject[data.chatId]?.map((item)=>{
                            if(item!==socket){
                                socket.send(data);
                            }
                        })
                    }
                    
                    else if(data.event===ChatEventEnum.TYPING_EVENT){
                        console.log('tyoing', conversationsObject[data.chatId])
                        conversationsObject[data.chatId]?.map((item)=>{
                            if(item!==socket){
                                socket.send(data);
                            }
                        })
                    }
                   
                } catch (error) {
                    socket.on("error",()=>{
                        console.log("soceket error while receiving event")
                    })
                }
            });

            socket.on("error",()=>{
                console.log("soceket error while connecting socket")
            })

            console.log('new connection')

    });
};


export { initializeSocketIO };