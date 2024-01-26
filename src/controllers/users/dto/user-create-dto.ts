import * as Joi from 'joi';
import { Types } from "mongoose";
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';



interface UserCreateResponseDto {
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    isActive: boolean;
    conversationId: Types.ObjectId[];
    messageId: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
const UserCreateDto = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
    password: Joi.string().required()
})

const UserCreateDtoJoiValidation = asyncHandler(async (req, res, next) => {
    const { error, value } = UserCreateDto.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
      }
    next()
})

export { UserCreateResponseDto, UserCreateDto, UserCreateDtoJoiValidation} 

