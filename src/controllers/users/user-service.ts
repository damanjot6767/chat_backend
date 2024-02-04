import { ApiError } from "../../utils/api-error";
import { UserModel } from "../../models/index";
import { changePassword, createUser, getUserByEmail, getUserById, getUserByLoginCredential, getUsers, updateUserById } from "../../models/user.model";
import { CreateUserDto, CreateUserResponseDto } from "./dto/create-user-dto";
import { LoginUserDto, LoginUserResponseDto, UpdateUserDto, UserResponseDto } from "./dto";

export const registerService = async (
    userCreateDto: CreateUserDto,
): Promise<CreateUserResponseDto> => {

    const user = await getUserByEmail(userCreateDto.email)
    if (user) throw new ApiError(400, 'User already exist')

    const userResponse = await createUser(userCreateDto)
    const { accessToken } = await generateAccessAndRefereshTokens(userResponse._id)

    const userDetails = await getUserById(userResponse._id);
    userDetails.accessToken = accessToken;
    return userDetails
}

export const loginService = async (
    { password, email }: LoginUserDto,
): Promise<LoginUserResponseDto> => {

    const user = await getUserByLoginCredential(email, password)
    if (!user) throw new ApiError(400, 'Invalid Credentials')

    const { accessToken } = await generateAccessAndRefereshTokens(user._id)
    user.accessToken = accessToken;

    return user
}

export const getUserService = async (
    id: string,
): Promise<LoginUserResponseDto> => {

    const user = await getUserById(id)
    return user
}
export const getAllUsersService = async (): Promise<UserResponseDto[]> => {

    const user = await getUsers()
    return user
}

export const updateUserService = async (
    id: string,
    updateUserDto: UpdateUserDto
): Promise<LoginUserResponseDto> => {

    const user = await updateUserById(id, updateUserDto)
    return user
}

export const handleSocialLoginService = async (
    userId: string,
): Promise<CreateUserResponseDto> => {

    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const { accessToken } = await generateAccessAndRefereshTokens(
        user._id
    );
    user["accessToken"] = accessToken

    return user
}

const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.generateAccessToken(user)
        const refreshToken = user.generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const generateTempraryToken = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId)
        const token = user.generateTempraryToken(user)

        return { token }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating mail token")
    }
}

export const changePasswordService = async (
    id: string,
    password: string
): Promise<LoginUserResponseDto> => {

    const user = await changePassword(id, password)
    return user
}

export const getUserByEmailService = async (
    email: string
): Promise<UserResponseDto> => {

    const user = await getUserByEmail(email)
    return user
}
