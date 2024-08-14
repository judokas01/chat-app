import { describe, beforeEach, beforeAll, it, expect } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { faker } from '@faker-js/faker'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { HasOne } from '@root/common/entities/common/Relationship'
import { Message } from '@root/common/entities/message.entity'

describe('User repository', () => {
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({})
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should create many messages and find them by conversation id', async () => {
        const { conversation, users } = await conversationMock.createOne({}, testModule)

        await Promise.all(
            Array.from({ length: 10 }).map((_) =>
                testModule.repositories.message.createOne({
                    author: HasOne.loaded(selectRandom(users), 'message.author'),
                    conversation: HasOne.loaded(conversation, 'message.author'),
                    text: faker.lorem.sentence(),
                }),
            ),
        )

        const found = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            { limit: 50 },
        )

        expect(found.items).toHaveLength(10)
        found.items.forEach(validateUserStructure)
    })
})

const validateUserStructure = (message: Message | null) => {
    expect(message).not.toBeNull()
    expect(message?.data).toMatchObject({
        author: expect.any(Object),
        conversation: expect.any(Object),
        createdAt: expect.any(Date),
        id: expect.any(String),
        isRemoved: false,
        text: expect.any(String),
    } satisfies Message['data'])
}

const selectRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
