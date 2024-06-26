import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';
const updateUserJoiValidationObject = Joi.object({ fullName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),})

const UpdateUserJoiValidation = asyncHandler(async (req, res, next) => {

    const { error, value } = updateUserJoiValidationObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { UpdateUserJoiValidation, updateUserJoiValidationObject }