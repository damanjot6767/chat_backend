import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "../constants";
import { Request } from "express";
import { UserModel } from "../models/index";
import { ApiError } from "../utils/api-error";
import { getChatByUserIdService } from "../controllers/chats/chat-service";
import { ChatResponseDto, CreateChatDto } from "../controllers/chats/dto";

interface SocketWithUser extends Socket {
    user: any
}

const mountJoinChatEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId: string) => {
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        socket.join(chatId);
    });
};

const mountParticipantTypingEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chatId: any) => {
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
    });
};

const mountParticipantStoppedTypingEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
};

const emitJoinChatEvents = (socket: SocketWithUser, chats:ChatResponseDto[]) => {
        chats?.map((chat)=>socket.join(chat._id?.toString()))
};

const initializeSocketIO = (io: Server) => {
    return io.on("connection", async (socket: SocketWithUser) => {
        try {
            // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

            let token:any = cookies?.accessToken; // get the accessToken

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


            // We are creating a room with user id so that if user is joined but does not have any active chat going on.
            // still we want to emit some socket events to the user.
            // so that the client can catch the event and show the notifications.
            socket.join(user._id.toString());
            socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
            console.log("User connected 🗼. userId: ", user._id.toString());

            // Common events that needs to be mounted on the initialization
            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);

            // // when ever user login then we create room with chat id that perticular user
            // const chats = await getChatByUserIdService(user?._id);
            // emitJoinChatEvents(socket, chats)


            socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
                console.log("user has disconnected 🚫. userId: " + socket.user?._id);
                if (socket.user?._id) {
                    socket.leave(socket.user._id);
                }
            });
        } catch (error) {
            socket.emit(
                ChatEventEnum.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
            );
        }
    });
};


const emitSocketEvent = (req: Request, roomId: string, event: ChatEventEnum, payload: any) => {
    req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };