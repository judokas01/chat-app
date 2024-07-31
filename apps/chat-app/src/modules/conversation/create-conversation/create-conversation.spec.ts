import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { CreateConversationService } from './create-conversation.service'

describe('CreateConversationService', () => {
    let service: CreateConversationService
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({ providers: [CreateConversationService] })
        service = testModule.module.get<CreateConversationService>(CreateConversationService)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should create new conversation', async () => {
        const user1 = await testModule.repositories.user.createOne(userMock.random.getOne())
        const user2 = await testModule.repositories.user.createOne(userMock.random.getOne())

        const createdConv = await service.create([user1.id, user2.id], 'some name')

        const found = await testModule.repositories.conversation.findById(createdConv.id)

        expect(found).not.toBeNull()
    })
})
