import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const UpdateMessageJoiValidation = asyncHandler(async (req, res, next) => {

    const messageObject = Joi.object({
        body: Joi.string(),
        image: Joi.string(),
        file: Joi.string(),
        video: Joi.string(),
    }).or('body', 'image', 'file', 'video').required();


    const { error, value } = messageObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { UpdateMessageJoiValidation }