import * as Joi from 'joi';
import { asyncHandler } from '../../../utils/async-handler';
import { ApiError } from '../../../utils/api-error';
import { AvailableChatType, ChatType } from '../../../constants';
import mongoose from 'mongoose';

const CreateChatJoiValidation = asyncHandler(async (req, res, next) => {

    const chatObject = Joi.object({
        name: Joi.string().optional(),
        chatType: Joi.string().valid(ChatType.GROUP, ChatType.INDIVIDUAL).required(),
        userIds: Joi.array()
            .items(Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error('id must be mongoose id'); // Custom error code for invalid ObjectId
                }
                return new mongoose.Types.ObjectId(value);;
            }))
            .when('chatType', {
                is: ChatType.INDIVIDUAL,
                then: Joi.array().length(1).required(),
                otherwise: Joi.array().min(2).required(),
            }),
    })

    const { error, value } = chatObject.validate(req.body);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

export { CreateChatJoiValidation }