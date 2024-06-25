import { Resolver, Args, Query } from '@nestjs/graphql'
import { IAuthenticateService } from '@root/auth/authenticate/authenticate.interface'
import { LoginRequest, LoginServiceResult } from '@root/auth/login/login.dto'
import { LoginService } from '@root/auth/login/login.service'
import { RegisterService } from '@root/auth/register/register.service'

@Resolver()
export class AuthResolver {
    constructor(
        private authService: IAuthenticateService,
        private registerService: RegisterService,
        private loginService: LoginService,
    ) {}

    @Query(() => LoginRequest)
    async logIn(@Args() args: LoginRequest): Promise<LoginServiceResult> {
        return await this.loginService.login(args)
    }
}
