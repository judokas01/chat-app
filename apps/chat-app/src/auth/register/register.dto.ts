import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class RegisterRequest {
    @IsEmail()
    email: string

    @IsStrongPassword({ minLength: 8, minSymbols: 0 })
    password: string

    @IsNotEmpty()
    userName: string
}
