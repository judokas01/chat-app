import { Module } from '@nestjs/common'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { RegisterService } from './register/register.service'
import { AuthenticateService } from './authenticate/authenticate.service'

@Module({
    providers: [LoginService, LogoutService, RegisterService, AuthenticateService],
})
export class AuthModule {}
