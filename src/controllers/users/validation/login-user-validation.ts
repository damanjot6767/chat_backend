import * as Joi from 'joi';
import { Types } from "mongoose";
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';


const LoginUserJoiValidation = asyncHandler(async (req, res, next) => {

    const userObject = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const { error, value } = userObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { LoginUserJoiValidation } 