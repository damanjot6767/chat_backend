"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/users/user-controller");
const validation_1 = require("../controllers/users/validation");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.route('/register').post(validation_1.CreateUserJoiValidation, user_controller_1.registerUser);
router.route('/login').post(validation_1.LoginUserJoiValidation, user_controller_1.loginUser);
router.route('/get-all-users').get(auth_middleware_1.verifyJWT, user_controller_1.getAllUsers);
router.route('/confirm-mail').get(auth_middleware_1.verifyMailJWT, user_controller_1.confirmMail);
router.route('/forget-password').post(user_controller_1.forgetPassword);
router.route('/forget-password').get(auth_middleware_1.verifyMailJWT, user_controller_1.forgetPasswordVerify);
router.route('/change-password').post(user_controller_1.changeForgetPassword);
router.route('/change-password').get(user_controller_1.changePasswordSuccess);
router.route('/:id').get(auth_middleware_1.verifyJWT, user_controller_1.getUser);
router.route('/update/:id').post(auth_middleware_1.verifyJWT, validation_1.UpdateUserJoiValidation, user_controller_1.updateUser);
router.route("/auth/google").get(passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}), (req, res) => {
    res.send("redirecting to google...");
});
router.route("/auth/google/callback")
    .get(passport_1.default.authenticate("google", { session: false }), user_controller_1.handleSocialLogin);
exports.default = router;
