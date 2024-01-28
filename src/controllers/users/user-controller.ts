import { cookieOptions } from "../../constants";
import { ApiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { getUserService, handleSocialLoginService, loginService, registerService, updateUserService } from "./user-service";


const registerUser = asyncHandler(async (req, res) => {

    const response = await registerService(req.body)

    return res.
        status(201).
        cookie("accessToken", response.accessToken, cookieOptions).
        json(
            new ApiResponse(
                201, response, 'User created successfully'
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {

    const response = await loginService(req.body)

    return res.
        status(200).
        cookie("accessToken", response.accessToken, cookieOptions).
        json(
            new ApiResponse(
                201, response, 'User login successfully'
            )
        )
})

const handleSocialLogin = asyncHandler(async (req: any, res) => {

    const response = await handleSocialLoginService(req.user?._id)

    return res
        .status(301)
        .cookie("accessToken", response?.accessToken, cookieOptions)
        .json(
            new ApiResponse(
                201, response, 'User login successfully'
            )
        )
});

const getUser = asyncHandler(async (req, res) => {

    const response = await getUserService(req.params.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'User get successfully'
            )
        )
})

const updateUser = asyncHandler(async (req, res) => {

    const response = await updateUserService(req.params.id, req.body)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'User get successfully'
            )
        )
})



export { registerUser, loginUser, getUser, updateUser, handleSocialLogin }