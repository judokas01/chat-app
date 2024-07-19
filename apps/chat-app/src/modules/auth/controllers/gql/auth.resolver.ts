import { Resolver, Args, Query, Mutation } from '@nestjs/graphql'
import { LoginService } from '@root/modules/auth/login/login.service'
import { RegisterService } from '@root/modules/auth/register/register.service'
import { LoginArgsGql, RegisterArgsGql } from './request-type'
import { LoginResponse, RegisterResponse } from './response'

@Resolver()
export class AuthResolver {
    constructor(
        private registerService: RegisterService,
        private loginService: LoginService,
    ) {}

    @Query(() => LoginResponse, { name: 'login' })
    async logIn(@Args() { password, userName }: LoginArgsGql): Promise<LoginResponse> {
        return await this.loginService.login({ password, userName })
    }

    @Mutation(() => RegisterResponse, { name: 'register' })
    async register(
        @Args() { email, password, userName }: RegisterArgsGql,
    ): Promise<RegisterResponse> {
        return await this.registerService.register({ email, password, userName })
    }
}
