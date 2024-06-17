import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { JWT } from '../common/jwt.module'
import { IUserRepository } from '../repository/user-repository.interface'
import { UserPrismaRepository } from '../repository/prisma/user.repository'
import { RegisterService } from '../register/register.service'
import { LoginService, LoginServiceResult } from './login.service'

describe('LoginService', () => {
    let service: LoginService
    let regService: RegisterService
    let repository: IUserRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JWT],
            providers: [
                LoginService,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                PrismaService,
                RegisterService,
            ],
        }).compile()

        service = module.get<LoginService>(LoginService)
        regService = module.get<RegisterService>(RegisterService)
        repository = module.get<IUserRepository>(IUserRepository)
        const prisma = module.get<PrismaService>(PrismaService)
        await prisma.user.deleteMany({})
        await prisma.userRenewToken.deleteMany({})
    })

    it('should create user, than attempt to log in and receive auth and access tokens', async () => {
        const userToCreate = userMock.random.getOne()

        await regService.register(userToCreate)

        const result = await service.login({
            password: userToCreate.password,
            userName: userToCreate.userName,
        })

        expect(result).toMatchObject({
            accessToken: expect.any(String),
            renewToken: expect.any(String),
        } satisfies LoginServiceResult)
    })
})
