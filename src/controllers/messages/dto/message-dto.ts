import { Chat } from "../../chats/dto/chat-dto";
import { User } from "../../users/dto/user-dto";

interface Message {
  _id: string;
  body: string;
  image: string;
  video: string;
  file: string;
  userIds: any[];
  users: User[];
  messageSentBy: User;
  chat: Chat;
  createdAt: Date;
  updatedAt: Date
}

interface MessageResponseDto extends Message {
}

export { Message, MessageResponseDto }


