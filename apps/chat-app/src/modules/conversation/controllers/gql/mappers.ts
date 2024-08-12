import { Conversation } from '@root/common/entities/conversation.entity'
import { Conversation as GqlConversation } from './response'

export const toGqlConversation = (conversation: Conversation): GqlConversation => {
    const { id, data } = conversation

    return {
        createdAt: data.createdAt,
        id,
        lastMessageAt: data.lastMessageAt,
        name: data.name ?? null,
        // todo implement
        users: [],
    }
}
