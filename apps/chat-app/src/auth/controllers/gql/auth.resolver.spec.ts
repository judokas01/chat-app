import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/auth/auth.module'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { AuthResolver } from './auth.resolver'
import { getLogInGqlRequest, commonUtil } from './helpers'

describe('AuthResolver', () => {
    let resolver: AuthResolver
    let testModule: TestInterfaceModule

    beforeAll(async () => {
        testModule = await getTestModuleWithInterface({
            module: AuthModule,
            providers: [AuthResolver],
        })

        resolver = testModule.module.get<AuthResolver>(AuthResolver)

        type a = Parameters<AuthResolver['logIn']>
        type b = Awaited<ReturnType<AuthResolver['logIn']>>
        const a: a = [{ password: '123', userName: 'test' }]
        const b: b = { accessToken: '', renewToken: '' }
    })

    afterAll(async () => {
        await testModule.destroy()
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    it('should get invalid credentials error message', async () => {
        const res = await testModule.requestGql.post('').send({
            query: `
            query ($password:String!,$userName:String!) {
                login(password: $password, userName: $userName) {
                    accessToken
                    accessToken
                }
            }`,
            variables: { password: 'asd', userName: 'asfasf' },
        })

        expect(res.body).toMatchSnapshot()
    })

    it('should get invalid credentials error message with test util', async () => {
        const user = userMock.random.getOne()

        const original = getLogInGqlRequest(user)
        const kk = commonUtil({
            args: [{ password: '123', userName: 'test' }],
            class: AuthResolver,
            classMethod: 'logIn',
            name: 'login',
            returnQuery: { accessToken: '', renewToken: '' },
            type: 'query',
        })

        console.log({ kk, original })

        const res = await testModule.requestGql.post('').send(kk)

        expect(res.body).toMatchSnapshot()
    })
})
