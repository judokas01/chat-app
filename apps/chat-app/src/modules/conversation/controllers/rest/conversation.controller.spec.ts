import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
    getTestModuleWithInterface,
    TestInterfaceModule,
} from '@root/common/test-utilities/test-app/interface'
import { ConversationModule } from '../../conversation.module'
import { ConversationController } from './conversation.controller'

describe('ConversationController', () => {
    let testModule: TestInterfaceModule
    let controller: ConversationController

    beforeEach(async () => {
        testModule = await getTestModuleWithInterface({
            module: ConversationModule,
            providers: [],
        })

        controller = testModule.module.get<ConversationController>(ConversationController)
        await testModule.cleanDb()
    })

    afterEach(async () => {
        await testModule.destroy()
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
