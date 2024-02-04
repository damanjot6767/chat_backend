import { Document } from "mongoose";
import { UserLoginType } from "../../../constants";

interface User {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  fullName: string;
  avatar?: string; // cloudinary url
  coverImage?: string; // cloudinary url
  isActive?: boolean;
  conversationId: string[];
  messageId: string[];
  accessToken: string;
  refreshToken?: string;
  password?: string;
  loginType?: UserLoginType;
  createdAt: Date;
  updatedAt: Date
}

interface UserResponseDto extends User {
}

export { User, UserResponseDto }


