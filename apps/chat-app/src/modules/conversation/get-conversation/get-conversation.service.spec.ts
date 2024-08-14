import { describe, beforeEach, it, expect, beforeAll } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { faker } from '@faker-js/faker'
import { GetConversationService } from './get-conversation.service'

describe('GetConversationService', () => {
    let service: GetConversationService
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({
            providers: [GetConversationService],
        })

        service = testModule.module.get<GetConversationService>(GetConversationService)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('create many user conversation and return all ordered by lastMessage date', async () => {
        const user = await userMock.random.createOne({}, testModule)
        const conversationCount = Math.floor(Math.random() * 10) + 3

        const conversations = await Promise.all(
            Array.from({ length: conversationCount }).map((_) =>
                conversationMock.createOne(
                    {
                        conversation: {
                            lastMessageAt: faker.datatype.boolean() ? faker.date.recent() : null,
                        },
                        user,
                    },
                    testModule,
                ),
            ),
        )

        const found = await service.getAllByUserId(user.id)
        expect(found).toHaveLength(conversations.length)

        const sorted = found.sort((a, b) => {
            if (!a.data.lastMessageAt) return 1
            if (!b.data.lastMessageAt) return -1
            return b.data.lastMessageAt.getTime() - a.data.lastMessageAt.getTime()
        })

        expect(found).toEqual(sorted)
    })
})
