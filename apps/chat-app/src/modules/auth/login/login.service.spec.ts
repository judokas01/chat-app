import { userMock } from '@root/common/test-utilities/mocks/user'
import { faker } from '@faker-js/faker'
import { describe, beforeEach, it, expect, beforeAll } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { RegisterService } from '../register/register.service'
import { LoginServiceResult, RenewRequest, LoginRequest } from '../dto/login.dto'
import { LoginService } from './login.service'
import { InvalidPasswordError, InvalidRenewTokenRequestError } from './exceptions'

describe('LoginService', () => {
    let service: LoginService
    let regService: RegisterService
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({ providers: [LoginService, RegisterService] })
        service = testModule.module.get<LoginService>(LoginService)
        regService = testModule.module.get<RegisterService>(RegisterService)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
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
