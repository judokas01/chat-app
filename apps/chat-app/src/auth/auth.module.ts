import { Module } from '@nestjs/common'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { RegisterService } from './register/register.service'
import { JwtAuthenticateService } from './authenticate/services/jwt-authenticate.service'
import { JWT } from './common/jwt.module'

@Module({
    imports: [JWT],
    providers: [LoginService, LogoutService, RegisterService, JwtAuthenticateService],
})
export class AuthModule {}
