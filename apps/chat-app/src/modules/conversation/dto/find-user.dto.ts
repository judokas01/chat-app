import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'

export class FindUserRequest {
    @IsOptional()
    @IsString()
    userName?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @ValidateIf((o) => !o.userName && !o.email)
    @IsNotEmpty({ message: 'Either userName or email must be provided' })
    groupValidation?: boolean
}
