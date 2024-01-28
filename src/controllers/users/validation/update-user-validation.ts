import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const UpdateUserJoiValidation = asyncHandler(async (req, res, next) => {

    const userObject = Joi.object({
        fullName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
    })

    const { error, value } = userObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { UpdateUserJoiValidation }