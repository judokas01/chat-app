import { Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { ConversationUser, Conversation as GqlConversation } from './response'

export const toGqlConversation = (conversation: Conversation): GqlConversation => {
    const { id, data } = conversation

    return {
        createdAt: data.createdAt,
        id,
        lastMessageAt: data.lastMessageAt,
        name: data.name ?? null,
        // todo implement
        users: conversation.data.participants.get().map(toGqlUser),
    }
}

export const toGqlUser = (user: Readonly<User>): ConversationUser => ({
    email: user.data.email,
    id: user.id,
    userName: user.data.userName,
})
