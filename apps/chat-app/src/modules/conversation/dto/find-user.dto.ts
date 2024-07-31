import { IsOptional, IsString } from 'class-validator'

export class FindUserRequest {
    @IsOptional({ groups: ['findUser'] })
    @IsString()
    id: string

    @IsOptional({ groups: ['findUser'] })
    @IsString()
    userName: string

    @IsOptional({ groups: ['findUser'] })
    @IsString()
    email: string
}
