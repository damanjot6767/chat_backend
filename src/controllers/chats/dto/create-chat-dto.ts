import { ChatType } from "../../../constants"
import { Chat } from "./chat-dto"


interface CreateChatResponseDto extends Chat {
}

interface CreateChatDto {
    name?: string,
    chatTYpe: ChatType,
    userIds: any[]
}

export { CreateChatResponseDto, CreateChatDto }

