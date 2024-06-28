import Joi from "joi";
import { asyncHandler } from "../../../utils/async-handler";
import { ApiError } from "../../../utils/api-error";

export const getUserByIdParamJoiValidationObject = Joi.object({
    userId: Joi.string().optional()
})

export const GetUserByIdParamJoiValidation = asyncHandler(async (req, res, next) => {

    const { error, value } = getUserByIdParamJoiValidationObject.validate(req.params);

    if (error) {
        throw new ApiError(400, error.message)
    }
    next()
})

