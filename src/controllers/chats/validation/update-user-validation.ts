import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const UpdateChatJoiValidation = asyncHandler(async (req, res, next) => {

    const chatObject = Joi.object({
        name: Joi.string()
    })

    const { error, value } = chatObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { UpdateChatJoiValidation }