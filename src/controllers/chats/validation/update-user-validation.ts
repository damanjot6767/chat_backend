import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const updateChatJoiValidationObject = Joi.object({
    name: Joi.string()
})
const UpdateChatJoiValidation = asyncHandler(async (req, res, next) => {

    const { error, value } = updateChatJoiValidationObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { UpdateChatJoiValidation, updateChatJoiValidationObject }