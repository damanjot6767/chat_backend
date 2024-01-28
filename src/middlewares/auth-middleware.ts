import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import { getUserById } from '../models/user.model';
import { UserResponseDto } from '../controllers/users/dto';

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', "");

    if (!token) {
        throw new ApiError(401, 'Unauthorized request')
    }

    const decodeToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user: any = await getUserById(decodeToken?._id)

    req.user = user._doc;
    next()
})

export { verifyJWT }
