import { HasMany } from './common/Relationship'
import type { Message } from './message.entity'
import type { User } from './user.entity'

export type Conversation = {
    id: string
    name: string | null
    participants: HasMany<User>
    createdAt: Date
    lastMessageAt: Date | null
    messages: HasMany<Message>
}

export type ConversationInput = Omit<Conversation, 'id' | 'createdAt' | 'lastMessageAt'>
