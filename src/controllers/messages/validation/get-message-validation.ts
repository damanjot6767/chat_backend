import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';
import mongoose from 'mongoose';

const getMessageByChatIdParamJoiValidationObject = Joi.object({
    id: Joi.string().required().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('id must be mongoose id');
        }
        return new mongoose.Types.ObjectId(value);;
    }),
})

const GetMessageByChatIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const { error, value } = getMessageByChatIdParamJoiValidationObject.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})
const getMessageByIdParamJoiValidationObject = Joi.object({
    id: Joi.string().required().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('id must be mongoose id');
        }
        return new mongoose.Types.ObjectId(value);;
    }),
});

const GetMessageByIdParamJoiValidation = asyncHandler(async (req, res, next) => {
    const { error, value } = getMessageByIdParamJoiValidationObject.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})


export { GetMessageByChatIdParamJoiValidation, GetMessageByIdParamJoiValidation, getMessageByIdParamJoiValidationObject, getMessageByChatIdParamJoiValidationObject }