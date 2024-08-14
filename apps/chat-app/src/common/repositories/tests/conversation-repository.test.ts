import { describe, beforeEach, beforeAll, it, expect } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { faker } from '@faker-js/faker'
import { HasMany } from '@root/common/entities/common/Relationship'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { Conversation } from '@root/common/entities/conversation.entity'

describe('User repository', () => {
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({})
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should create conversation and retrieve it by id', async () => {
        const users = await Promise.all(
            Array.from({ length: 2 }).map((_) => userMock.random.createOne({}, testModule)),
        )

        const conversation = await testModule.repositories.conversation.createOne({
            lastMessageAt: null,
            messages: HasMany.loaded([], 'conversation.messages'),
            name: faker.lorem.word(),
            participants: HasMany.loaded(users, 'conversation.participants'),
        })

        const found = await testModule.repositories.conversation.findById(conversation.id)

        validateUserStructure(found)
    })

    it('should create many conversation and retrieve some by userId', async () => {
        const [mainUser, ...rest] = await Promise.all(
            Array.from({ length: 7 }).map((_) => userMock.random.createOne({}, testModule)),
        )

        await Promise.all(
            rest.map((user) =>
                testModule.repositories.conversation.createOne({
                    lastMessageAt: null,
                    messages: HasMany.loaded([], 'conversation.messages'),
                    name: faker.lorem.word(),
                    participants: HasMany.loaded([mainUser, user], 'conversation.participants'),
                }),
            ),
        )

        const found = await testModule.repositories.conversation.findAllByUserId(mainUser.id)

        expect(found).toHaveLength(6)
        found.map(validateUserStructure)
    })
})

const validateUserStructure = (conversation: Conversation | null) => {
    expect(conversation).not.toBeNull()
    expect(conversation?.data).toMatchObject({
        createdAt: expect.any(Date),
        id: expect.any(String),
        lastMessageAt: null,
        messages: expect.any(HasMany),
        name: expect.any(String),
        participants: expect.any(HasMany),
    } satisfies Conversation['data'])
}
