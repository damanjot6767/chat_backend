import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middleware";
import { CreateChatJoiValidation, GetChatByUserIdParamJoiValidation, GetChatParamJoiValidation, UpdateChatJoiValidation } from "../controllers/chats/validation";
import { createChat, deleteChat, getChatById, getChatByUserId, updateChat } from "../controllers/chats/chat-controller";


const router = Router();

router.route('/create').post(
    verifyJWT,
    CreateChatJoiValidation,
    createChat
)

router.route('/:id').get(
    verifyJWT,
    GetChatParamJoiValidation,
    getChatById
)

router. route('/chat-by-user-id/:userId').get(
    verifyJWT,
    GetChatByUserIdParamJoiValidation,
    getChatByUserId
)

router.route('/update/:id').post(
    verifyJWT,
    UpdateChatJoiValidation,
    updateChat
)

router.route('/delete/:id').delete(
    verifyJWT,
    deleteChat
)

export default router;