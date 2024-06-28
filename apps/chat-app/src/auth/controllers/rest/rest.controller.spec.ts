import { RegisterService } from '@root/auth/register/register.service'
import { LoginService } from '@root/auth/login/login.service'
import { TestModule, getTestModule } from '@root/common/test-utilities/container'
import { RestController } from './rest.controller'

describe('Auth Rest Controller tests', () => {
    let controller: RestController
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({
            controllers: [RestController],
            providers: [RegisterService, LoginService],
        })
        controller = testModule.module.get<RestController>(RestController)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
