import { getChatById, updateChatById } from "../../models/chat.model";
import { createMessage, getMessageById, updateMessageById } from "../../models/message.model";
import { ApiError } from "../../utils/api-error";
import { CreateMessageDto, CreateMessageResponseDto } from "./dto/create-message-dto";
import { UpdateMessageDto, UpdateMessageResponseDto } from "./dto/update-message-dto";

export const createMessageService = async (
    user,
    createMessageDto: CreateMessageDto,
): Promise<CreateMessageResponseDto> => {

    const chat = await getChatById(createMessageDto.chatId)
    const userIds = chat.userIds.map((item) => ({ isMessageDelete: false, userId: item.userId }))

    createMessageDto.userIds = userIds;
    createMessageDto.messageSentBy = user._id;
    const messageResponse = await createMessage(createMessageDto);

    chat.messageIds.push(messageResponse._id)
    await updateChatById(chat._id, { messageIds: chat.messageIds })

    return messageResponse
}

export const updateMessageService = async (
    id: string,
    updateMessageDto: UpdateMessageDto
): Promise<UpdateMessageResponseDto> => {

    const isMessageExist = await getMessageById(id)
    if (!isMessageExist) throw new ApiError(400, 'Invalid Message id')

    const message = await updateMessageById(id, updateMessageDto)
    return message
}

export const deleteMessageService = async (
    user: any,
    id: string,
): Promise<any> => {

    const message = await getMessageById(id)

    message?.userIds.forEach((item) => {

        if (item?.userId.toString() === user._id.toString() && item.isMessageDelete) {
            throw new ApiError(400, 'Message already deleted by user')
        }

        if (item?.userId.toString() === user._id.toString()) {
            item.isMessageDelete = true;
        }

        return item
    })
    const updatedMessage = await updateMessageById(id, { userIds: message.userIds })

    return updatedMessage
}


