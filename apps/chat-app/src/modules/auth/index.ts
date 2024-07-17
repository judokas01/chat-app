import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IUserRepository } from '../../common/repositories/user.repository'
import { LoginService } from './login/login.service'
import { RegisterService } from './register/register.service'
import { JwtAuthenticateService } from './authenticate/services/jwt-authenticate.service'
import { JWT } from './common/jwt.module'
import { RestController } from './controllers/rest/rest.controller'
import { IAuthenticateService } from './authenticate/authenticate.interface'
import { AuthResolver } from './controllers/gql/auth.resolver'

@Module({
    controllers: [RestController],
    exports: [
        LoginService,
        RegisterService,
        JwtAuthenticateService,
        ConfigService,
        PrismaService,
        ValidationPipe,
        AuthResolver,
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IAuthenticateService, useClass: JwtAuthenticateService },
    ],
    imports: [JWT],
    providers: [
        LoginService,
        RegisterService,
        JwtAuthenticateService,
        ConfigService,
        PrismaService,
        ValidationPipe,
        AuthResolver,
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IAuthenticateService, useClass: JwtAuthenticateService },
    ],
})
export class AuthModule {}
