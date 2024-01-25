import * as Joi from 'joi';
import { Types } from "mongoose";

interface UserCreateResponseDto {
    email: string;
    fullName: string;
    avatar: string;
    coverImage?: string;
    isActive: boolean;
    conversationId: Types.ObjectId[];
    messageId: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export default UserCreateResponseDto

export const UserCreateDto = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
    avatar: Joi.string().optional(),
    coverImage: Joi.string().optional(),
})