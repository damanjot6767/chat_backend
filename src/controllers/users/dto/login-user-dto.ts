import { User } from './user-dto';

interface LoginUserResponseDto extends User {
}

interface LoginUserDto {
    email: string,
    fullName: string,
    password: string
}

export { LoginUserResponseDto, LoginUserDto }

