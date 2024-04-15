import { ApiError } from "../../utils/api-error";
import { UpdateChatDto, ChatResponseDto, CreateChatResponseDto, CreateChatDto } from "./dto";
import { createChat, deleteChatById, getAggregationChatById, getChatByUserIds, getAggregationChatsByUserId, updateChatById } from "../../models/chat.model";
import { User } from "../users/dto/user-dto";
import { getUserById } from "../../models/user.model";

export const createChatService = async (
    user,
    createChatDto: CreateChatDto,
): Promise<CreateChatResponseDto> => {

    const userIds = createChatDto.userIds.map((id) => {
        if (id.toString() !== user._id.toString()) {
            return { isChatDelete: false, userId: id }
        }
    })

    if (!createChatDto.userIds.length) throw new ApiError(400, 'Receiver user id must be different from main user');

    userIds.push({ isChatDelete: false, userId: user._id })
    for (const userObject of userIds) {
        await getUserById(userObject.userId)
    }

    const chat = await getChatByUserIds(createChatDto.userIds)
    if (chat?.[0]) {
        chat[0]['message'] = 'Chat already created'
        return chat[0]
    }

    else {
        createChatDto.userIds = userIds;
        createChatDto.createdBy = user._id

        let chatResponse = await createChat(createChatDto)
        chatResponse = await getAggregationChatById(chatResponse._id)
        return chatResponse
    }
}

export const getChatService = async (
    user,
    id: string,
): Promise<ChatResponseDto> => {

    const chat = await getAggregationChatById(id)
    return chat
}

export const getChatByUserIdService = async (
    id: string,
): Promise<ChatResponseDto[]> => {

    const chat = await getAggregationChatsByUserId(id)
    return chat
}

export const updateChatService = async (
    id: string,
    updateChatDto: UpdateChatDto
): Promise<ChatResponseDto> => {

    const chat = await updateChatById(id, updateChatDto)
    return chat
}

export const deleteChatService = async (
    user: any,
    id: string,
): Promise<any> => {

    const chat = await getAggregationChatById(id)

    chat?.userIds.forEach((item) => {

        if (item?.userId.toString() === user._id.toString() && item.isChatDelete) {
            throw new ApiError(400, 'Chat already deleted by user')
        }

        if (item?.userId.toString() === user._id.toString()) {
            item.isChatDelete = true;
        }

        return item
    })
    await updateChatById(id, { userIds: chat.userIds })

    return chat
}


