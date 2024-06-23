import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { ConfigService } from '@root/common/config/config-service.service'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { UserPrismaRepository } from '../repository/prisma/user.repository'
import { IUserRepository } from '../repository/user-repository.interface'
import { RegisterService } from './register.service'
import { UserAlreadyExistsError } from './exceptions'
import { RegisterRequest } from './register.dto'

describe('RegisterService', () => {
    let service: RegisterService
    let repository: IUserRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                PrismaService,
                ConfigService,
                ValidationPipe,
            ],
        }).compile()

        service = module.get<RegisterService>(RegisterService)
        repository = module.get<IUserRepository>(IUserRepository)
        const prisma = module.get<PrismaService>(PrismaService)

        // todo refactor test utils
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should create user and retrieve it', async () => {
        const created = await service.register(userMock.random.getOne())

        const found = await repository.findByUserName(created.userName)

        expect(found).not.toBeNull()
        expect(found).toMatchObject(created)
    })

    it.each([
        { overrides: { email: 'not-email' }, text: 'email is not valid' },
        { overrides: { password: '123' }, text: 'password is weak' },
    ] satisfies { overrides: Partial<RegisterRequest>; text: string }[])(
        'should throw error, when ',
        async ({ overrides }) => {
            await expect(service.register(userMock.random.getOne(overrides))).rejects.toThrow(
                BadRequestException,
            )
        },
    )

    it('should throw when user already exists', async () => {
        const user = userMock.random.getOne()
        await repository.createOne(user)

        await expect(service.register(user)).rejects.toThrow(UserAlreadyExistsError)
    })
})
