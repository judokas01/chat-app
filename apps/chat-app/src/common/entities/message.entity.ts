import type { Conversation } from './conversation.entity'
import type { User } from './user.entity'

export type Message = {
    id: string
    text: string
    author: User
    conversation: Conversation
    createdAt: Date
    isRemoved: boolean
}

export type MessageInput = Omit<Message, 'id' | 'createdAt' | 'isRemoved'>
