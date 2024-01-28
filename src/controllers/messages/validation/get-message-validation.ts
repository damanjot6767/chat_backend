import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';
import mongoose from 'mongoose';

const GetMessageByChatIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const chatParam = Joi.object({
        id: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('id must be mongoose id');
            }
            return new mongoose.Types.ObjectId(value);;
        }),
    })

    const { error, value } = chatParam.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

const GetMessageByIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const chatParam = Joi.object({
        id: Joi.string().required().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('id must be mongoose id');
            }
            return new mongoose.Types.ObjectId(value);;
        }),
    })

    const { error, value } = chatParam.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})


export { GetMessageByChatIdParamJoiValidation, GetMessageByIdParamJoiValidation }