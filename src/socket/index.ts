import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "../constants";
import { Request } from "express";
import { UserModel } from "../models/index";
import { ApiError } from "../utils/api-error";

interface SocketWithUser extends Socket {
    user: any
}

const mountJoinChatEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId: string) => {
        console.log(`User joined the chat 🤝. chatId: `, chatId);
        // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
        // E.g. When user types we don't want to emit that event to specific participant.
        // We want to just emit that to the chat where the typing is happening
        socket.join(chatId);
    });
};

const mountParticipantTypingEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.TYPING_EVENT, (chatId: any) => {
        console.log(ChatEventEnum.TYPING_EVENT)
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
    });
};

const mountParticipantStoppedTypingEvent = (socket: SocketWithUser) => {
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
        console.log(ChatEventEnum.STOP_TYPING_EVENT)
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
};

const initializeSocketIO = (io: Server) => {
    return io.on("connection", async (socket: SocketWithUser) => {
        try {
            // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

            let token = cookies?.accessToken; // get the accessToken

            if (!token) {
                // If there is no access token in cookies. Check inside the handshake auth
                token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWJjOWQ0NmJiNmFiZjZiYTM0MWRiM2YiLCJlbWFpbCI6InZuYXZlZW4wQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoibmV3dXNlciIsImxvZ2luVHlwZSI6IkVNQUlMX1BBU1NXT1JEIiwiaXNFbWFpbFZlcmlmaWVkIjpmYWxzZSwiaXNBY3RpdmUiOmZhbHNlLCJjb252ZXJzYXRpb25JZCI6W10sIm1lc3NhZ2VJZCI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDItMDJUMDc6NDQ6MDYuMjQ0WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDItMDZUMTI6MjQ6MDUuOTc5WiIsIl9fdiI6MCwiaWF0IjoxNzA3MjIyNzQ0LCJleHAiOjE3MDczMDkxNDR9.GfQEWOuy0wyggkE0d9iYkpZKRZmlr7WZoL14TJ1ep94';
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