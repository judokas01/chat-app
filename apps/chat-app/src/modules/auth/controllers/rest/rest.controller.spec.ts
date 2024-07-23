import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/modules/auth/auth.module'
import { RegisterRequest, RegisteredUser } from '@root/modules/auth/dto/register.dto'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { UserInput } from '@root/common/entities/user.entity'
import { LoginRequest, LoginServiceResult } from '@root/modules/auth/dto/login.dto'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

describe('Auth Rest Controller tests', () => {
    let testModule: TestInterfaceModule

    beforeAll(async () => {
        testModule = await getTestModuleWithInterface({ module: AuthModule })
    })

    afterAll(async () => {
        await testModule.destroy()
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    describe('register', () => {
        it('should return registered user', async () => {
            const userToCreate = userMock.random.getOne()
            const response = await testModule.request.post('/auth/register').send(userToCreate)

            expect(response.body).toMatchObject({
                createdAt: expect.any(String),
                email: expect.any(String),
                id: expect.any(String),
                userName: expect.any(String),
            } satisfies Omit<RegisteredUser, 'conversations'>)
        })

        it('should return registered user', async () => {
            const userToCreate = userMock.random.getOne()
            const response = await testModule.request
                .post('/auth/register')
                .send(userToCreate satisfies RegisterRequest)

            expect(response.body).toMatchObject({
                createdAt: expect.any(String),
                email: expect.any(String),
                id: expect.any(String),
                userName: expect.any(String),
            } satisfies Omit<RegisteredUser, 'conversations'>)
        })

        it.each([
            { override: { password: '123' }, text: 'password is week' },
            { override: { email: 'not-email' }, text: 'email is not email' },
            { override: { userName: undefined }, text: 'userName is undefined' },
            {
                override: { email: 'not-email', password: '123', userName: undefined },
                text: 'multiple properties are wrong',
            },
        ] satisfies {
            override: Partial<UserInput>
            text: string
        }[])('should return invalid request when $text', async ({ override }) => {
            const userToCreate = userMock.random.getOne(override)
            const response = await testModule.request.post('/auth/register').send(userToCreate)

            expect(response.status).toBe(400)
            expect(response.body).toMatchSnapshot()
        })
    })

    describe('register + login', () => {
        it('should register user and log in with credentials', async () => {
            const userToCreate = userMock.random.getOne()
            await testModule.request.post('/auth/register').send(userToCreate)

            const result = await testModule.request.post('/auth/login').send({
                password: userToCreate.password,
                userName: userToCreate.userName,
            } satisfies LoginRequest)

            expect(result.body).toMatchObject({
                accessToken: expect.any(String),
                renewToken: expect.any(String),
            } satisfies LoginServiceResult)
        })

        it('should return 400 when credentials are incorrect', async () => {
            const result = await testModule.request.post('/auth/login').send({
                password: 'some-password',
                userName: 'usr',
            } satisfies LoginRequest)

            expect(result.status).toBe(400)
            expect(result.body).toMatchSnapshot()
        })
    })
})
