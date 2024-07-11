import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class LoginArgsGql {
    @Field()
    password: string

    @Field()
    userName: string
}

@ArgsType()
export class RegisterArgsGql {
    @Field()
    password: string

    @Field()
    userName: string

    @Field()
    email: string
}
