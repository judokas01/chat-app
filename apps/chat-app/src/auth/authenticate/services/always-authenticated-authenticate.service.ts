import { Injectable } from '@nestjs/common'
import { IAuthenticateService } from '../authenticate.interface'

@Injectable()
export class AlwaysAuthenticatedAuthenticateService implements IAuthenticateService {
    canActivate() {
        return true
    }
}
