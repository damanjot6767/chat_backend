import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';
import { getUserById } from '../models/user.model';
import { UserResponseDto } from '../controllers/users/dto';
import { User } from '../controllers/users/dto/user-dto';

declare module 'express-serve-static-core' { // handle req.user typescript error
    interface Request {
        user: User
    }
}



const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.split(' ')?.[1];

    if (!token) {
        throw new ApiError(401, 'Unauthorized request')
    }

    const decodeToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user: any = await getUserById(decodeToken?._id)

    req.user = user._doc;
    next()
})

const verifyMailJWT = async (req, res, next) => {
    try {

        const token = req.query.token as string

        if (!token) {
            throw new ApiError(401, 'Unauthorized request')
        }

        const decodeToken: any = jwt.verify(token, process.env.TEMPRARY_TOKEN_SECRET);
        const user: any = await getUserById(decodeToken?._id)

        req.user = user._doc;
        next()

    } catch (error) {
        
        res.render(
            'mail-confirmation-expired',
            {
                error: error.message === 'jwt expired'
                    ? 'Token Expired' :
                    error.message
            }
        )
    }
}

export { verifyJWT, verifyMailJWT }
