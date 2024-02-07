import { Message } from "./message-dto"

interface CreateMessageResponseDto extends Message {
}

interface CreateMessageDto {
    body: string,
    image: string;
    video: string;
    file: string;
    chatId: string;
    userIds: any[];
    messageSentBy: string;
}

export { CreateMessageResponseDto, CreateMessageDto }

