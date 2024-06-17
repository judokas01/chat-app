import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { UserPrismaRepository } from '../repository/prisma/user.repository'
import { IUserRepository } from '../repository/user-repository.interface'
import { RegisterService } from './register.service'
import { UserAlreadyExistsError } from './exceptions'

describe('RegisterService', () => {
    let service: RegisterService
    let repository: IUserRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                PrismaService,
            ],
        }).compile()

        service = module.get<RegisterService>(RegisterService)
        repository = module.get<IUserRepository>(IUserRepository)
        const prisma = module.get<PrismaService>(PrismaService)

        // todo refactor test utils
        await prisma.user.deleteMany({})
        await prisma.userRenewToken.deleteMany({})
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

    it('should throw when user already exists', async () => {
        const user = userMock.random.getOne()
        await repository.createOne(user)

        await expect(service.register(user)).rejects.toThrow(UserAlreadyExistsError)
    })
})
