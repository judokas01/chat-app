import type { User } from './user.entity'

export type Conversation = {
    id: string
    name: string
    participants: User[]
    createdAt: Date
    lastMessageAt: Date
}
