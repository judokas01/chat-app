import { ExecutionContext, Injectable } from '@nestjs/common'
import { JWTPayload } from '@root/modules/auth/common/types'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IAuthGuard } from '../authenticate.guard'

@Injectable()
export class AlwaysAuthenticatedAuthenticateService implements IAuthGuard {
    constructor() {}

    private payload?: JWTPayload

    canActivate = (context: ExecutionContext) => {
        GqlExecutionContext.create(context).getContext().user = this.payload
        return true
    }

    static createWithPayload = (payload: JWTPayload) => {
        const service = new AlwaysAuthenticatedAuthenticateService().setPayload(payload)
        return service
    }

    private setPayload = (payload: JWTPayload) => {
        this.payload = payload
        return this
    }
}
