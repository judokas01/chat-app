import { Test, TestingModule } from '@nestjs/testing'
import { LoginService } from '@root/auth/login/login.service'
import { RegisterService } from '@root/auth/register/register.service'
import { JWT } from '@root/auth/common/jwt.module'
import { JwtAuthenticateService } from '@root/auth/authenticate/services/jwt-authenticate.service'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { ValidationPipe } from '@nestjs/common'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import { UserPrismaRepository } from '@root/auth/repository/prisma/user.repository'
import { IAuthenticateService } from '@root/auth/authenticate/authenticate.interface'
import { AuthResolver } from './auth.resolver'

describe('AuthResolver', () => {
    let resolver: AuthResolver

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JWT],
            providers: [
                LoginService,
                RegisterService,
                AuthResolver,
                JwtAuthenticateService,
                ConfigService,
                PrismaService,
                ValidationPipe,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                { provide: IAuthenticateService, useClass: JwtAuthenticateService },
            ],
        }).compile()

        resolver = module.get<AuthResolver>(AuthResolver)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
})
