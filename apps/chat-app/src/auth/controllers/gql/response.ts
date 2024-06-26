import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LoginResponseGql {
    @Field()
    accessToken: string

    @Field()
    renewToken: string
}
