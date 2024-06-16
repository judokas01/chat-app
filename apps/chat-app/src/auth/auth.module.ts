import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { RegisterService } from './register/register.service'
import { AuthenticateService } from './authenticate/authenticate.service'
import { JWT_EXPIRE_IN, JWT_SECRET } from './config'
import { RenewService } from './renew/renew.service'

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: JWT_EXPIRE_IN },
        }),
    ],
    providers: [LoginService, LogoutService, RegisterService, AuthenticateService, RenewService],
})
export class AuthModule {}
