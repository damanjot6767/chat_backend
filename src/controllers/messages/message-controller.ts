
import { ChatEventEnum } from "../../constants";
import { emitSocketEvent } from "../../socket";
import { ApiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { createMessageService, deleteMessageService, getMessagesByChatIdService, updateMessageService } from "./message-service";


const createMessage = asyncHandler(async (req, res) => {

    const response = await createMessageService(req.user, req.body)

    response.userIds.forEach((user)=>{

        if(user.userId.toString()!==req?.user._id.toString()){
            emitSocketEvent(req,user?.userId?.toString(),ChatEventEnum.MESSAGE_RECEIVED_EVENT,response)
        }

    })

    return res.
        status(201).
        json(
            new ApiResponse(
                201, response, 'Message created successfully'
            )
        )
})

const updateMessage = asyncHandler(async (req, res) => {

    const response = await updateMessageService(req.params.id, req.body)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'Message update successfully'
            )
        )
})

const getMessagesByChatId = asyncHandler(async (req, res) => {

    const response = await getMessagesByChatIdService(req.params.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'Messages get successfully'
            )
        )
})

const deleteMessage = asyncHandler(async (req, res) => {

    const response = await deleteMessageService(req.user, req.params.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, 'Message delete successfully'
            )
        )
})


export { createMessage, updateMessage, deleteMessage, getMessagesByChatId }