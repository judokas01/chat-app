import { HasOne } from './common/Relationship'
import type { Conversation } from './conversation.entity'
import type { User } from './user.entity'

export type Message = {
    id: string
    text: string
    author: HasOne<User>
    conversation: HasOne<Conversation>
    createdAt: Date
    isRemoved: boolean
}

export type MessageInput = Omit<Message, 'id' | 'createdAt' | 'isRemoved'>
