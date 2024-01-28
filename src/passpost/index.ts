import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ApiError } from "../utils/api-error";
import { createUser, getUserByEmail, getUserById } from "../models/user.model";
import { UserLoginType } from "../constants";


try {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (_, __, profile, next) => {

                const user = await getUserByEmail(profile._json.email);
                if (user) {
                    if (user.loginType !== UserLoginType.GOOGLE) {
                        next(
                            new ApiError(
                                400,
                                "You have previously registered using " +
                                user.loginType?.toLowerCase()?.split("_").join(" ") +
                                ". Please use the " +
                                user.loginType?.toLowerCase()?.split("_").join(" ") +
                                " login option to access your account."
                            ),
                            null
                        );
                    } else {
                        next(null, user);
                    }
                } else {
                    const createdUser = await createUser({
                        email: profile._json.email,
                        fullName: profile._json.name,
                        password: profile._json.sub,
                        isEmailVerified: true,
                        avatar: profile._json.picture,
                        loginType: UserLoginType.GOOGLE
                    });
                    if (createdUser) {
                        next(null, createdUser);
                    } else {
                        next(new ApiError(500, "Error while registering the user"), null);
                    }
                }
            }
        )
    );

} catch (error) {
    console.error("PASSPORT ERROR: ", error);
}

export { passport }


