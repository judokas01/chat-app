import { HasMany } from './common/Relationship'
import type { Message } from './message.entity'
import type { User } from './user.entity'

export class Conversation {
    constructor(private conversation: ConversationData) {}

    get data() {
        return this.conversation
    }

    get id() {
        return this.conversation.id
    }

    clone = () => new Conversation({ ...this.conversation })
}

export type ConversationData = {
    id: string
    name: string | null
    participants: HasMany<User>
    createdAt: Date
    lastMessageAt: Date | null
    messages: HasMany<Message>
}

export type ConversationInput = Omit<ConversationData, 'id' | 'createdAt'>
