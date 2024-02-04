import { User } from './user-dto';

interface UpdateUserResponseDto extends User {
}

interface UpdateUserDto {
    fullName?: string,
    isEmailVerified?: boolean,
    password?: string
}

export { UpdateUserResponseDto, UpdateUserDto }

