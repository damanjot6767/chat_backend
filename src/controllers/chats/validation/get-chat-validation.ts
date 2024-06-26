import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';

const getChatParamJoiValidationObject = Joi.object({
    id: Joi.string().required()
})

const GetChatParamJoiValidation = asyncHandler(async (req, res, next) => {
    const { error, value } = getChatParamJoiValidationObject.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

const getChatByUserIdParamJoiValidationObject = Joi.object({
    userId: Joi.string().optional()
})

const GetChatByUserIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const { error, value } = getChatByUserIdParamJoiValidationObject.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { GetChatParamJoiValidation, GetChatByUserIdParamJoiValidation, getChatByUserIdParamJoiValidationObject, getChatParamJoiValidationObject }