import { ArgsType, Field } from '@nestjs/graphql'

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

@ArgsType()
export class GetConversationMessagesArgsGql {
    @Field()
    conversationId: string

    @Field(() => Pagination)
    pagination: Pagination
}

@ArgsType()
export class Pagination {
    @Field()
    cursor: string

    @Field()
    limit: number
}

@ArgsType()
export class SendMessageArgsGql {
    @Field()
    text: string

    @Field()
    conversationId: string
}
