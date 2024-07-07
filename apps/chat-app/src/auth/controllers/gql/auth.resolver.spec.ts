import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/auth/auth.module'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { AuthResolver } from './auth.resolver'
import { getLogInGqlRequest, getRegisterGqlRequest } from './helpers'

describe('AuthResolver', () => {
    let testModule: TestInterfaceModule

    beforeAll(async () => {
        testModule = await getTestModuleWithInterface({
            module: AuthModule,
            providers: [AuthResolver],
        })
    })

    afterAll(async () => {
        await testModule.destroy()
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should get invalid credentials error message', async () => {
        const user = userMock.random.getOne()

        const res = await testModule.requestGql.send(getLogInGqlRequest(user))

        expect(res.body).toMatchSnapshot()
    })

    it('should register via GQL', async () => {
        const user = userMock.random.getOne()

        const res = await testModule.requestGql.send(getRegisterGqlRequest(user))

        console.log(res.body)
        expect(res.body).toMatchSnapshot()
    })
})
