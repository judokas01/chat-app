import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/auth/auth.module'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { RegisterService } from '@root/auth/register/register.service'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { AuthResolver } from './auth.resolver'
import { getLogInGqlRequest, getRegisterGqlRequest } from './helpers'
import { LoginResponse, RegisterResponse } from './response'

describe('AuthResolver', () => {
    let testModule: TestInterfaceModule
    let registerService: RegisterService

    afterEach(async () => {
        await testModule.destroy()
    })

    beforeEach(async () => {
        testModule = await getTestModuleWithInterface({
            module: AuthModule,
            providers: [AuthResolver],
        })
        registerService = testModule.module.get<RegisterService>(RegisterService)
        await testModule.cleanDb()
    })

    it('should get invalid credentials error message', async () => {
        const user = userMock.random.getOne()

        const res = await testModule.requestGql.send(getLogInGqlRequest(user))

        expect(res.body).toMatchSnapshot()
    })

    it('should correctly log in', async () => {
        const user = userMock.random.getOne()
        await registerService.register(user)

        const res = await testModule.requestGql.send(getLogInGqlRequest(user))

        expect(res.body.data.login).toMatchObject({
            accessToken: expect.any(String),
            renewToken: expect.any(String),
        } satisfies LoginResponse)
    })

    it('should register via GQL', async () => {
        const user = userMock.random.getOne()

        const res = await testModule.requestGql.send(getRegisterGqlRequest(user))

        expect(res.body.data.register).toMatchObject({
            email: expect.any(String),
            id: expect.any(String),
            userName: expect.any(String),
        } satisfies RegisterResponse)
    })
})
