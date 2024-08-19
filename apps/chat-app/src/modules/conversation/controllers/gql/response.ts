import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Conversation {
    @Field(() => String)
    id: string

    @Field(() => String, { nullable: true })
    name: string | null

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    lastMessageAt: Date | null

    @Field(() => [ConversationUser], { nullable: true })
    users: ConversationUser[]
}

@ObjectType()
export class ConversationUser {
    @Field(() => String)
    id: string

    @Field(() => String)
    userName: string

    @Field(() => String)
    email: string
}

@ObjectType()
export class ConversationMessageResponse {
    @Field(() => String)
    cursor: string

    @Field(() => Boolean)
    hasMore: boolean

    @Field(() => [Message])
    messages: Message[]
}

@ObjectType()
export class Message {
    @Field(() => String)
    id: string

    @Field(() => String)
    text: string

    @Field(() => ConversationUser)
    author: ConversationUser

    @Field(() => Date)
    createdAt: Date

    @Field(() => Boolean)
    isRemoved: boolean
}
