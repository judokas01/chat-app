import { CanActivate, Inject, Injectable } from '@nestjs/common'

export interface IAuthGuard extends CanActivate {}

export const IAuthGuard = Symbol('IAuthGuard')

@Injectable()
export class AuthGuard implements IAuthGuard {
    constructor(@Inject(IAuthGuard) private authService: IAuthGuard) {}

    canActivate = this.authService.canActivate
}
