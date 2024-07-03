import { Controller, Post, Body } from '@nestjs/common'
import { LoginRequest, LoginServiceResult, RenewRequest } from '@root/auth/login/login.dto'
import { LoginService } from '@root/auth/login/login.service'
import { RegisterRequest, RegisteredUser } from '@root/auth/register/register.dto'
import { RegisterService } from '@root/auth/register/register.service'
import { toRegisterResponse } from './mappers'

@Controller('auth')
export class RestController {
    constructor(
        private registerService: RegisterService,
        private loginService: LoginService,
    ) {}

    @Post('/register')
    async register(@Body() registerReq: RegisterRequest): Promise<RegisteredUser> {
        const result = await this.registerService.register(registerReq)
        return toRegisterResponse(result)
    }

    @Post('/login')
    async login(@Body() loginReq: LoginRequest): Promise<LoginServiceResult> {
        return await this.loginService.login(loginReq)
    }

    @Post('/renew')
    async renewToken(@Body() renewReq: RenewRequest): Promise<LoginServiceResult> {
        return await this.loginService.renewToken(renewReq)
    }
}
