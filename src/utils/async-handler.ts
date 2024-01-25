import UserCreateResponseDto from 'controllers/users/dto/user-create-dto';
import { Request, Response, NextFunction, RequestHandler } from 'express';

interface CustomRequest extends Request {
  user?: UserCreateResponseDto
}

const asyncHandler = (requestHandler: RequestHandler) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (err) {
      next(err);
    }
  };
};

export { asyncHandler };
