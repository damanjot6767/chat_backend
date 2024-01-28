import { ChatType } from "../../../constants";
import { User } from "../../users/dto/user-dto";

interface Chat {
  _id: string;
  name: string;
  userIds: any[];
  users: string[] | User[];
  messageIds: any[];
  messages: string[];
  latestMessage: string;
  chatType?: ChatType;
  createdAt: Date;
  updatedAt: Date
}

interface ChatResponseDto extends Chat {
}

export { Chat, ChatResponseDto }


