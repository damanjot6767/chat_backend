export const DB_NAME: string = 'chat'


export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const AvailableUserRoles: string[] = Object.values(UserRolesEnum);


export const ChatEventEnum = {
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping",
  TYPING_EVENT: "typing",
} as const;

export type ChatEvent = keyof typeof ChatEventEnum;


export const cookieOptions = {
  httpOnly: true,
  secure: false, // Adjust this based on your environment (e.g., use `true` in production with HTTPS)
};

export enum UserLoginType {
  GOOGLE= "GOOGLE",
  GITHUB= "GITHUB",
  EMAIL_PASSWORD= "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

export enum ChatType {
  INDIVIDUAL= "INDIVIDUAL",
  GROUP= "GROUP"
};

export const AvailableChatType= Object.values(ChatType);

export const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.ts'],
};


