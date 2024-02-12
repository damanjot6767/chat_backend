import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middleware";
import { CreateMessageJoiValidation, UpdateMessageJoiValidation } from "../controllers/messages/validation";
import { createMessage, deleteMessage, getMessagesByChatId, updateMessage } from "../controllers/messages/message-controller";
import { GetMessageByIdParamJoiValidation } from "../controllers/messages/validation/get-message-validation";


const router = Router();;;

router.route('/create').post(
    verifyJWT,
    CreateMessageJoiValidation,
    createMessage
)


router.route('/update/:id').post(
    verifyJWT,
    GetMessageByIdParamJoiValidation,
    UpdateMessageJoiValidation,
    updateMessage
)

router.route('/by-chat-id/:id').get(
    verifyJWT,
    GetMessageByIdParamJoiValidation,
    getMessagesByChatId
)

router.route('/delete/:id').delete(
    verifyJWT,
    GetMessageByIdParamJoiValidation,
    deleteMessage
)

export default router;