import { CommonTestModule } from '@root/common/test-utilities/test-app/common/types'
import { Conversation } from '@root/common/entities/conversation.entity'
import { HasMany } from '@root/common/entities/common/Relationship'
import { userMock } from '../user'

const createRandomConversation = async (
    overrides: { userCount?: number; conversation?: Partial<Conversation> },
    module: CommonTestModule,
) => {
    const users = await Promise.all(
        Array.from({ length: overrides.userCount || 2 }).map(() =>
            userMock.random.createOne({}, module),
        ),
    )

    const conversation = await module.repositories.conversation.createOne({
        messages: new HasMany(undefined, 'conversation.messages'),
        name: null,
        participants: new HasMany(
            users.map((e) => e.id),
            'conversation.participants',
        ),
        ...overrides.conversation,
    })

    return { conversation, users }
}

export const conversationMock = {
    createOne: createRandomConversation,
}
