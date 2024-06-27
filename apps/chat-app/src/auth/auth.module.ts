import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { LoginService } from './login/login.service'
import { RegisterService } from './register/register.service'
import { JwtAuthenticateService } from './authenticate/services/jwt-authenticate.service'
import { JWT } from './common/jwt.module'
import { RestController } from './controllers/rest/rest.controller'
import { IUserRepository } from './repository/user-repository.interface'
import { UserPrismaRepository } from './repository/prisma/user.repository'
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
