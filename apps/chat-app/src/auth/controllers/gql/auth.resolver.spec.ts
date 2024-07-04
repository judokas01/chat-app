import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/auth/auth.module'
import { AuthResolver } from './auth.resolver'

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
})
