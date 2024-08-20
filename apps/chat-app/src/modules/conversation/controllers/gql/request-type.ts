import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql'

@ArgsType()
export class GetConversationArgsGql {
    @Field()
    userId: string
}

@ArgsType()
export class FindUsersArgsGql {
    @Field({ nullable: true })
    userName: string

    @Field({ nullable: true })
    email: string
}

@ArgsType()
export class CreateConversationArgsGql {
    @Field(() => [String])
    userIds: string[]

    @Field({ nullable: true })
    name: string
}

@ObjectType()
export class Pagination {
    @Field(() => String)
    cursor: string

    @Field(() => Int)
    limit: number
}

@ArgsType()
export class GetConversationMessagesArgsGql {
    @Field()
    conversationId: string

    @Field(() => Pagination)
    pagination: Pagination
}

@ArgsType()
export class SendMessageArgsGql {
    @Field()
    text: string

    @Field()
    conversationId: string
}
