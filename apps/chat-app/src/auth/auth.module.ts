import { Module } from '@nestjs/common'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { RegisterService } from './register/register.service'
import { AuthenticateService } from './authenticate/authenticate.service'
import { JWT } from './common/jwt.module'

@Module({
    imports: [JWT],
    providers: [LoginService, LogoutService, RegisterService, AuthenticateService],
})
export class AuthModule {}
