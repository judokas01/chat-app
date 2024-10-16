import { ExecutionContext, Injectable } from '@nestjs/common'
import { JWTPayload } from '@root/modules/auth/common/types'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IAuthGuard } from '../authenticate.guard'

@Injectable()
export class AlwaysAuthenticatedAuthenticateService implements IAuthGuard {
    constructor(private user: JWTPayload = alwaysAuthenticatedUser) {}

    canActivate(_context: ExecutionContext) {
        GqlExecutionContext.create(_context).getContext().user = this.user
        return true
    }
}

export const alwaysAuthenticatedUser = { sub: 'some-id', userName: 'someUserName' }
