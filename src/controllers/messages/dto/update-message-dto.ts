import { Message } from "./message-dto";

interface UpdateMessageResponseDto extends Message {
}

interface UpdateMessageDto {
    body: string,
    image: string,
    file: string,
    video: string
}

export { UpdateMessageResponseDto, UpdateMessageDto }

