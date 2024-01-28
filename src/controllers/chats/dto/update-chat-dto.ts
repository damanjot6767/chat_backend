import { Chat } from "./chat-dto";

interface UpdateChatResponseDto extends Chat {
}

interface UpdateChatDto {
    name: string,
}

export { UpdateChatResponseDto, UpdateChatDto }

