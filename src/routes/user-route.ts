import { UserCreateDto } from "controllers/users/dto/user-create-dto";
import { Router } from "express";
import { upload } from "middlewares/multer-middleware";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar', maxCount: 1
        },
        {
            name: 'coverImage', maxCount: 1
        }
    ]),
    UserCreateDto.validate(req.body)
    
)