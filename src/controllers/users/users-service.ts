import { ApiError } from "../../utils/api-error";
import { UserModel } from "../../models/index";
import { UserCreateDto, UserCreateResponseDto } from "./dto/user-create-dto";

// User Services
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = async (id: string): Promise<any> => {
    try {
        const user = await UserModel.findById(id).select('-password -refreshToken').lean()

        if (!user) throw new ApiError(401, 'User not found or Invalid Token')
        return user
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding user by id")
    }
}
export const createUser = (values: typeof UserCreateDto) => new UserModel(values).save().then((user: UserCreateResponseDto) => user);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

export const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}