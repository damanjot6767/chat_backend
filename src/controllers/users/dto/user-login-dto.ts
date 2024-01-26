import * as Joi from 'joi';
import { Types } from "mongoose";
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';


const UserLoginDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const UserLoginDtoJoiValidation = asyncHandler(async (req, res, next) => {
    const { error, value } = UserLoginDto.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
      }
    next()
})

export { UserLoginDtoJoiValidation} 

