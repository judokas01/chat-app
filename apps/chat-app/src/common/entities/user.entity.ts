import { HasMany } from './common/Relationship'
import type { Conversation } from './conversation.entity'

export type User = {
    id: string
    userName: string
    email: string
    password: string
    createdAt: Date
    conversations: HasMany<Conversation>
}

export type UserInput = Omit<User, 'id' | 'createdAt'>
