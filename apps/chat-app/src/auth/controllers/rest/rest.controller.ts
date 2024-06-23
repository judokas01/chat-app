import { Controller, Post, Body } from '@nestjs/common'
import { LoginService } from '@root/auth/login/login.service'
import { RegisterRequest } from '@root/auth/register/register.dto'
import { RegisterService } from '@root/auth/register/register.service'

@Controller('auth-rest')
export class RestController {
    constructor(
        private registerService: RegisterService,
        private loginService: LoginService,
    ) {}

    @Post('register')
    async register(@Body() registerRequest: RegisterRequest): Promise<void> {
        await this.registerService.register(registerRequest)
    }
}
