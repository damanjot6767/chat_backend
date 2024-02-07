import { Router } from "express";
import { upload } from "../middlewares/multer-middleware";
import { changeForgetPassword, confirmMail, getAllUsers, getUser, handleSocialLogin, loginUser, registerUser, updateUser, forgetPassword, verifyEmail } from "../controllers/users/user-controller";
import { CreateUserJoiValidation, LoginUserJoiValidation, UpdateUserJoiValidation } from "../controllers/users/validation";
import { verifyJWT, verifyMailJWT } from "../middlewares/auth-middleware";
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

router.route('/get-all-users').get(
    verifyJWT,
    getAllUsers
)

router.route('/confirm-mail').get(
    verifyMailJWT,
    confirmMail
)

router.route('/forget-password').post(
    forgetPassword
)

router.route('/change-password').post(
    verifyMailJWT,
    changeForgetPassword
)

router.route('/verify-email').get(
    verifyJWT,
    verifyEmail
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

router.route("/auth/google/callback")
    .get(passport.authenticate("google", { session: false }), handleSocialLogin);

export default router;