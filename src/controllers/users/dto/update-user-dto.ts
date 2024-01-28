import { User } from './user-dto';

interface UpdateUserResponseDto extends User {
}

interface UpdateUserDto {
    fullName: string,
}

export { UpdateUserResponseDto, UpdateUserDto }

