import { Router } from "express";
import { upload } from "../middlewares/multer-middleware";
import { getUser, handleSocialLogin, loginUser, registerUser, updateUser } from "../controllers/users/user-controller";
import { CreateUserJoiValidation, LoginUserJoiValidation, UpdateUserJoiValidation } from "../controllers/users/validation";
import { verifyJWT } from "../middlewares/auth-middleware";
import passport from "passport";


const router = Router();

router.route('/register').post(
    CreateUserJoiValidation,
    registerUser
)

router.route('/login').post(
    LoginUserJoiValidation,
    loginUser
)

router.route('/:id').get(
    verifyJWT,
    getUser
)

router.route('/update/:id').post(
    verifyJWT,
    UpdateUserJoiValidation,
    updateUser
)

router.route("/auth/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to google...");
    }
);

router
    .route("/auth/google/callback")
    .get(passport.authenticate("google", { session: false }), handleSocialLogin);
export default router;