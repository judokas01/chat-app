import { Inject } from '@nestjs/common'
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql'
import { IAuthenticateService } from '@root/auth/authenticate/authenticate.interface'
import { LoginService } from '@root/auth/login/login.service'
import { RegisterService } from '@root/auth/register/register.service'
import { LoginArgsGql, RegisterArgsGql } from './request-type'
import { LoginResponseGql, RegisterResponseGql } from './response'

@Resolver()
export class AuthResolver {
    constructor(
        @Inject(IAuthenticateService) private authService: IAuthenticateService,
        private registerService: RegisterService,
        private loginService: LoginService,
    ) {}

    @Query(() => LoginResponseGql, { name: 'register' })
    async logIn(@Args() { password, userName }: LoginArgsGql): Promise<LoginResponseGql> {
        return await this.loginService.login({ password, userName })
    }

    @Mutation(() => RegisterResponseGql, { name: 'register' })
    async register(
        @Args() { email, password, userName }: RegisterArgsGql,
    ): Promise<RegisterResponseGql> {
        return await this.registerService.register({ email, password, userName })
    }
}
