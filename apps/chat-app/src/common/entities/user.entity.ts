import type { Conversation } from './conversation.entity'

export type User = {
    id: string
    userName: string
    email: string
    password: string
    createdAt: Date
    conversations: Conversation[]
}

export type UserInput = Omit<User, 'id' | 'createdAt'>
