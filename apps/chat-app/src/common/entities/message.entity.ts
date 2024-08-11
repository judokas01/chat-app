import { HasOne } from './common/Relationship'
import type { Conversation } from './conversation.entity'
import type { User } from './user.entity'

export class Message {
    constructor(private message: MessageData) {}

    get data() {
        return this.message
    }

    get id() {
        return this.message.id
    }

    clone = () => new Message({ ...this.message })
}

export type MessageData = {
    id: string
    text: string
    author: HasOne<User>
    conversation: HasOne<Conversation>
    createdAt: Date
    isRemoved: boolean
}

export type MessageInput = Omit<MessageData, 'id' | 'createdAt' | 'isRemoved'>
