import { CanActivate } from '@nestjs/common'

export interface IAuthGuard extends CanActivate {}

export const IAuthGuard = Symbol('IAuthGuard')
