import { RegisterService } from '@root/auth/register/register.service'
import { LoginService } from '@root/auth/login/login.service'
import {
    TestInterfaceModule,
    getTestModuleWithInterface,
} from '@root/common/test-utilities/test-app/interface'
import { AuthModule } from '@root/auth/auth.module'
import { RestController } from './rest.controller'

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

    it('should register', async () => {
        const response = await testModule.request
            .post('/auth/register')
            .send({ email: 'mail@aa.aa', password: 'VeryStr@ngPass!123', userName: 'userName' })
        console.log({ response: response.body })
    })
})
