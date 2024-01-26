import { Router } from "express";
import { upload } from "../middlewares/multer-middleware";
import { UserCreateDtoJoiValidation } from "../controllers/users/dto/user-create-dto";
import { loginUser, registerUser } from "../controllers/users/users-controller";
import { UserLoginDtoJoiValidation } from "../controllers/users/dto/user-login-dto";


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
   UserCreateDtoJoiValidation,
   registerUser
)
router.route('/login').post(
   UserLoginDtoJoiValidation,
   loginUser
)

export default router;