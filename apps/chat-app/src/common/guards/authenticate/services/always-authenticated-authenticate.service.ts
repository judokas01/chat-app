import { ExecutionContext, Injectable } from '@nestjs/common'
import { IAuthGuard } from '../authenticate.guard'

@Injectable()
export class AlwaysAuthenticatedAuthenticateService implements IAuthGuard {
    canActivate(_context: ExecutionContext) {
        return true
    }
}
