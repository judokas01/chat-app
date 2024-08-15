import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class GetConversationArgsGql {
    @Field()
    userId: string
}
