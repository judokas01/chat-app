import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Conversation {
    @Field()
    id: string

    @Field({ nullable: true })
    name: string | null

    @Field()
    createdAt: Date

    @Field({ nullable: true })
    lastMessageAt: Date | null

    @Field(() => [ConversationUser], { nullable: true })
    users: ConversationUser[]
}

@ObjectType()
export class ConversationUser {
    @Field()
    id: string

    @Field()
    userName: string

    @Field()
    email: string
}
