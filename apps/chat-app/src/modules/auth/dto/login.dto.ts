import { IsNotEmpty } from 'class-validator'

export class LoginRequest {
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    userName: string
}

export class RenewRequest {
    @IsNotEmpty()
    authToken: string

    @IsNotEmpty()
    renewToken: string
}

export class LoginServiceResult {
    @IsNotEmpty()
    accessToken: string

    @IsNotEmpty()
    renewToken: string
}
