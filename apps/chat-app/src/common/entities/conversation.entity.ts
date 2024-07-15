import type { Message } from './message.entity'
import type { User } from './user.entity'

export type Conversation = {
    id: string
    name: string | null
    participants: User[]
    createdAt: Date
    lastMessageAt: Date
    messages: Message[]
}

export type ConversationInput = Omit<Conversation, 'id' | 'createdAt' | 'lastMessageAt'>
