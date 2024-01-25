import { getUserById } from 'controllers/users/users-service';
import jwt from 'jsonwebtoken';
import { ApiError } from 'utils/api-error';
import { asyncHandler } from 'utils/async-handler';

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', "");

    if (!token) {
        throw new ApiError(401, 'Unauthorized request')
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await getUserById(decodeToken?._id)

    req.user = user;
    next()
})
