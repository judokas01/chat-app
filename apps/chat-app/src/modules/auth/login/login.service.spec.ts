import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { faker } from '@faker-js/faker'
import { ConfigService } from '@root/common/config/config-service.service'
import { ValidationPipe } from '@nestjs/common'
import { describe, beforeEach, it, expect } from 'vitest'
import { JWT } from '../common/jwt.module'
import { IUserRepository } from '../repository/user-repository.interface'
import { UserPrismaRepository } from '../repository/prisma/user.repository'
import { RegisterService } from '../register/register.service'
import { LoginService } from './login.service'
import { LoginServiceResult, RenewRequest, LoginRequest } from './login.dto'
import { InvalidPasswordError, InvalidRenewTokenRequestError } from './exceptions'

describe('LoginService', () => {
    let service: LoginService
    let regService: RegisterService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JWT],
            providers: [
                LoginService,
                { provide: IUserRepository, useClass: UserPrismaRepository },
                PrismaService,
                RegisterService,
                ConfigService,
                ValidationPipe,
            ],
        }).compile()

        service = module.get<LoginService>(LoginService)
        regService = module.get<RegisterService>(RegisterService)
        const prisma = module.get<PrismaService>(PrismaService)
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
    })

    it('should create user, then attempt to log in and receive auth and access tokens', async () => {
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

    it('should create user and log in user, then renew tokens when auth token expires', async () => {
        const userToCreate = userMock.random.getOne()

        await regService.register(userToCreate)

        const loggedIn = await service.login({
            password: userToCreate.password,
            userName: userToCreate.userName,
        })

        await new Promise((resolve) => setTimeout(resolve, 2100))

        const renewed = await service.renewToken({
            authToken: loggedIn.accessToken,
            renewToken: loggedIn.renewToken,
        })

        expect(renewed).toMatchObject({
            accessToken: expect.any(String),
            renewToken: expect.any(String),
        } satisfies LoginServiceResult)

        expect(renewed).not.toMatchObject(loggedIn)
        expect(renewed.accessToken).not.toEqual(loggedIn.accessToken)
    }, 10000)

    it.each([
        { authToken: userMock.random.getStrongPassword() },
        { renewToken: userMock.random.getStrongPassword() },
        {
            authToken: userMock.random.getStrongPassword(),
            renewToken: userMock.random.getStrongPassword(),
        },
    ] satisfies Partial<RenewRequest>[])(
        'should throw error auth and renew token combination is invalid',
        async (args) => {
            const userToCreate = userMock.random.getOne()

            await regService.register(userToCreate)

            const loggedIn = await service.login({
                password: userToCreate.password,
                userName: userToCreate.userName,
            })

            await expect(
                service.renewToken({
                    authToken: loggedIn.accessToken,
                    renewToken: loggedIn.renewToken,
                    ...args,
                }),
            ).rejects.toThrow(InvalidRenewTokenRequestError)
        },
    )

    it.each([
        { password: userMock.random.getStrongPassword() },
        { userName: faker.internet.userName() },
        { password: userMock.random.getStrongPassword(), userName: faker.internet.userName() },
    ] satisfies Partial<LoginRequest>[])(
        'should throw error when user and password is incorrect',
        async (args) => {
            const userToCreate = userMock.random.getOne()

            await regService.register(userToCreate)

            await expect(
                service.login({
                    password: userToCreate.password,
                    userName: userToCreate.userName,
                    ...args,
                }),
            ).rejects.toThrow(InvalidPasswordError)
        },
    )
})
