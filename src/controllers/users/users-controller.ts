import { cookieOptions } from "../../constants";
import { ApiError } from "../../utils/api-error";
import { ApiResponse } from "../../utils/api-response";
import { asyncHandler } from "../../utils/async-handler";
import { createUser, generateAccessAndRefereshTokens, getUserByEmail, getUserById } from "./users-service";

const registerUser = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const user = await getUserByEmail(email)

    if (user) throw new ApiError(400, 'User already exist')

    const userResponse = await createUser(req.body)
    const { accessToken } = await generateAccessAndRefereshTokens(userResponse._id)

    const userDetails = await getUserById(userResponse._id);
    userDetails.accessToken = accessToken;

    return res.
        status(200).
        cookie("accessToken", accessToken, cookieOptions).
        json(
            new ApiResponse(
                201, userDetails, 'User created successfully'
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await getUserByEmail(email)
    if (!user) throw new ApiError(400, 'Invalid credentials')

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(400, 'Invalid credentials')
   
    const { accessToken } = await generateAccessAndRefereshTokens(user._id)

    const userDetails = await getUserById(user._id);
    userDetails.accessToken = accessToken;

    return res.
        status(200).
        cookie("accessToken", accessToken, cookieOptions).
        json(
            new ApiResponse(
                201, userDetails, 'User created successfully'
            )
        )
})

export { registerUser, loginUser }