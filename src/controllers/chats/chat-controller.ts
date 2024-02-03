
import { ChatEventEnum } from "../../constants";
import { emitSocketEvent } from "../../socket";
import { ApiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { createChatService, deleteChatService, getChatByUserIdService, getChatService, updateChatService } from "./chat-service";


const createChat = asyncHandler(async (req, res) => {

    const response = await createChatService(req.user,req.body)
    
    response.userIds.forEach((user)=>{

        if(user.userId!==req?.user._id){
            emitSocketEvent(req,user.userId,ChatEventEnum.NEW_CHAT_EVENT,response)
        }

    })
  
    return res.
        status(201).
        json(
            new ApiResponse(
                201, response, 'Chat created successfully'
            )
        )
})


const getChatById = asyncHandler(async (req, res) => {

    const response = await getChatService(req.user,req.params.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'Chat get successfully'
            )
        )
})

const getChatByUserId = asyncHandler(async (req, res) => {

    const response = await getChatByUserIdService(req.params.userId)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'Chat get successfully'
            )
        )
})

const updateChat = asyncHandler(async (req, res) => {

    const response = await updateChatService(req.params.id, req.body)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'Chat get successfully'
            )
        )
})

const deleteChat = asyncHandler(async (req, res) => {

    const response = await deleteChatService(req.user,req.params.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, 'Chat delete successfully'
            )
        )
})


export { createChat, getChatById, getChatByUserId, updateChat, deleteChat }