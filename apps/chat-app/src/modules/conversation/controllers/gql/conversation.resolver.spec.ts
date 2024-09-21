import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
    getTestModuleWithInterface,
    TestInterfaceModule,
} from '@root/common/test-utilities/test-app/interface'
import { ConversationModule } from '../../conversation.module'
import { ConversationResolver } from './conversation.resolver'

describe('ConversationResolver', () => {
    let testModule: TestInterfaceModule
    let resolver: ConversationResolver

    beforeEach(async () => {
        testModule = await getTestModuleWithInterface({
            module: ConversationModule,
            providers: [],
        })

        resolver = testModule.module.get<ConversationResolver>(ConversationResolver)
        await testModule.cleanDb()
    })

    afterEach(async () => {
        await testModule.destroy()
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
})
