import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LoginResponseGql {
    @Field()
    accessToken: string

    @Field()
    renewToken: string
}

@ObjectType()
export class RegisterResponseGql {
    @Field()
    id: string

    @Field()
    userName: string

    @Field()
    email: string
}
