import { CommonTestModule } from '@root/common/test-utilities/test-app/common/types'
import { Conversation } from '@root/common/entities/conversation.entity'
import { HasMany } from '@root/common/entities/common/Relationship'
import { User } from '@root/common/entities/user.entity'
import { userMock } from '../user'

const createRandomConversation = async (
    overrides: { userCount?: number; conversation?: Partial<Conversation>; user?: User },
    module: CommonTestModule,
) => {
    const users = await Promise.all(
        Array.from({ length: overrides.userCount || 2 }).map(() =>
            userMock.random.createOne({}, module),
        ),
    )

    const allUsers = [overrides.user, ...users].filter(Boolean) as User[]

    const conversation = await module.repositories.conversation.createOne({
        lastMessageAt: null,
        messages: HasMany.unloaded('conversation.messages'),
        name: null,
        participants: HasMany.loaded(allUsers, 'conversation.participants'),
        ...overrides.conversation,
    })

    return { conversation, users: allUsers }
}

export const conversationMock = {
    createOne: createRandomConversation,
}
