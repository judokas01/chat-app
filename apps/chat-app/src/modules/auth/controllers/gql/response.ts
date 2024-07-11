import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string

    @Field()
    renewToken: string
}

@ObjectType()
export class RegisterResponse {
    @Field()
    id: string

    @Field()
    userName: string

    @Field()
    email: string
}
