import { Test, TestingModule } from '@nestjs/testing'
import { RegisterService } from '@root/auth/register/register.service'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import { UserPrismaRepository } from '@root/auth/repository/prisma/user.repository'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { ConfigService } from '@root/common/config/config-service.service'
import { JWT } from '@root/auth/common/jwt.module'
import { ValidationPipe } from '@nestjs/common'
import { LoginService } from '@root/auth/login/login.service'
import { RestController } from './rest.controller'

describe('RestController', () => {
    let controller: RestController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RestController],
            imports: [JWT],
            providers: [
                RegisterService,
                LoginService,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                PrismaService,
                ConfigService,
                ValidationPipe,
            ],
        }).compile()

        controller = module.get<RestController>(RestController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
