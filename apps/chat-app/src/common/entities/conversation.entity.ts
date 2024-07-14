import type { User } from './user.entity'

export type Conversation = {
    id: string
    name: string | null
    participants: User[]
    createdAt: Date
    lastMessageAt: Date
}

export type ConversationInput = Omit<Conversation, 'id' | 'createdAt' | 'lastMessageAt'>
