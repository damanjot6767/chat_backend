import { User } from './user-dto';

interface CreateUserResponseDto extends User {
}

interface CreateUserDto {
    email: string,
    fullName: string,
    password: string
}

export { CreateUserResponseDto, CreateUserDto };;;

