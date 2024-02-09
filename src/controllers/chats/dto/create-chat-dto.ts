import { ChatType } from "../../../constants"
import { Chat } from "./chat-dto"


interface CreateChatResponseDto extends Chat {
}

interface CreateChatDto {
    name?: string,
    chatTYpe: ChatType,
    userIds: any[],
    createdBy: string,
}

export { CreateChatResponseDto, CreateChatDto }

