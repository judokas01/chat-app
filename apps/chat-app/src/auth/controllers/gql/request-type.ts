import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class LoginArgsGql {
    @Field()
    password: string

    @Field()
    userName: string
}
