import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IUserRepository } from '../../common/repositories/user.repository'
import { AuthGuard } from '../../common/guards/authenticate/services/jwt-authenticate.service'
import { IAuthGuard } from '../../common/guards/authenticate/authenticate.guard'
import { LoginService } from './login/login.service'
import { RegisterService } from './register/register.service'
import { JWT } from './common/jwt.module'
import { RestController } from './controllers/rest/rest.controller'
import { AuthResolver } from './controllers/gql/auth.resolver'

@Module({
    controllers: [RestController],
    exports: [
        LoginService,
        RegisterService,
        AuthGuard,
        ConfigService,
        PrismaService,
        ValidationPipe,
        AuthResolver,
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IAuthGuard, useClass: AuthGuard },
    ],
    imports: [JWT],
    providers: [
        LoginService,
        RegisterService,
        AuthGuard,
        ConfigService,
        PrismaService,
        ValidationPipe,
        AuthResolver,
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IAuthGuard, useClass: AuthGuard },
    ],
})
export class AuthModule {}
