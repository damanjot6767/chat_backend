import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const GetChatParamJoiValidation = asyncHandler(async (req, res, next) => {

    const chatParam = Joi.object({
        id: Joi.string().required()
    })

    const { error, value } = chatParam.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

const GetChatByUserIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const chatParam = Joi.object({
        userId: Joi.string().required()
    })

    const { error, value } = chatParam.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { GetChatParamJoiValidation, GetChatByUserIdParamJoiValidation }