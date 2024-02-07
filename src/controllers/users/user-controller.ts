import { cookieOptions } from "../../constants";
import { ApiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { ForgetPasswordMailOptions, RegisterMailOptions, SendMail } from "../../utils/mail";
import { User } from "./dto/user-dto";
import { generateTempraryToken, getAllUsersService, getUserService, handleSocialLoginService, loginService, registerService, updateUserService, changePasswordService, getUserByEmailService } from "./user-service";


const registerUser = asyncHandler(async (req, res) => {

    const response = await registerService(req.body)

    const { token } = await generateTempraryToken(response._id)

    res.
        status(201).
        cookie("accessToken", response.accessToken, cookieOptions).
        json(
            new ApiResponse(
                201, response, 'We sent a link to your email please click on to verify your mail'
            )
        )
    SendMail(await RegisterMailOptions(response, token))
})

const loginUser = asyncHandler(async (req, res) => {

    const response = await loginService(req.body)

    return res.
        status(200).
        cookie("accessToken", response.accessToken).
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

    const response = await getUserService(req.user._id || req.params?.id)

    return res.
        status(200).
        json(
            new ApiResponse(
                201, response, 'User get successfully'
            )
        )
})

const getAllUsers = asyncHandler(async (req, res) => {

    const response = await getAllUsersService()

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

const confirmMail = asyncHandler(async (req, res) => {

    let response: User;
    response = await getUserService(req.user?._id);

    if(response.isEmailVerified) {
        res.render(
            'mail-already-confirmed',
            {
                userEmail: response.email,
                userName: response.fullName,
                link: process.env.FRONTEND_REDIRECT_URL
            });
        return;
    }

    response = await updateUserService(req.user?._id, { isEmailVerified: true })
    res.render(
        'mail-confirmation-success',
        {
            userEmail: response.email,
            userName: response.fullName,
            link: process.env.FRONTEND_REDIRECT_URL
        }
    );
})

const forgetPassword = asyncHandler(async (req, res) => {

    const user = await getUserByEmailService(req.body.email)

    res.
        status(201).
        json(
            new ApiResponse(
                201, user, 'We sent forget password link please click on that link.'
            )
        )

    if (user) {
        const { token } = await generateTempraryToken(user._id)
        SendMail(ForgetPasswordMailOptions(user, token))
    }

})

const changeForgetPassword = asyncHandler(async (req, res) => {

    const response = await changePasswordService(req.user?._id, req.body?.new_password)
    // await SendMail(RegisterMailOptions([response.email], mailConfirmationToken))

    return res.
        status(201).
        json(
            new ApiResponse(
                201, response, 'password changed successfully'
            )
        )

})

const verifyEmail = asyncHandler(async (req, res) => {

    const { token } = await generateTempraryToken(req.user._id)

    res.
    status(201).
    json(
        new ApiResponse(
            201, null, 'We sent a link to your email please click on to verify your mail'
        )
    )
    SendMail(await RegisterMailOptions(req.user, token))

})

export {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    handleSocialLogin,
    getAllUsers,
    confirmMail,
    forgetPassword,
    changeForgetPassword,
    verifyEmail
}