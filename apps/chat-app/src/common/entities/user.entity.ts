import { HasMany } from './common/Relationship'
import type { Conversation } from './conversation.entity'

export class User {
    constructor(private user: UserData) {}

    get data() {
        return this.user
    }

    get id() {
        return this.user.id
    }

    clone = () => new User({ ...this.user })
}

export type UserData = {
    id: string
    userName: string
    email: string
    password: string
    createdAt: Date
    conversations: HasMany<Conversation>
}

export type UserInput = Omit<UserData, 'id' | 'createdAt'>
